import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { HomeApiResponse } from "../models/libro-service.model";
import { map } from "rxjs";
import { LibroAlquiladoResponse } from "../models/profile.model";
import { Libro } from "../models/libro.model";

@Injectable({
    providedIn: 'root'
})
export class LibrosService {
    private baseUrl = environment.baseUrl;
    private http = inject(HttpClient);

    getData_Old() {
    return this.http
      .get<HomeApiResponse>(this.baseUrl + 'Libros/title')
      .pipe(map(res => res.data ?? []));        // ← devolvemos solo el array
    }

    getData() {
      return this.http.get<Libro[]>(this.baseUrl + 'Libros/title');

    }

    getAlquiladosPorDni(dni: string) {
    return this.http
      .get<LibroAlquiladoResponse[]>(
        `${this.baseUrl}Clientes/${encodeURIComponent(dni)}/libros-alquilados`,
        { params: { soloActivos: true } }
      )
      .pipe(
        map(items => (items ?? []).map(i => ({
          ...i,
          // Para que el pipe |date funcione sí o sí:
          fechaPedido: new Date(i.fechaPedido) as any, // (o cambia el tipo a Date en la interfaz)
          // Aseguramos número por si llega como string:
          subTotal: Number(i.subTotal),
          precioUnitario: Number(i.precioUnitario),
          cantidad: Number(i.cantidad),
        })))
      );
    }
}