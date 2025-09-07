import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { HomeApiResponse } from "../models/libro-service.model";
import { map } from "rxjs";
import { LibroAlquiladoResponse } from "../models/profile.model";
import { Libro } from "../models/libro.model";
import { CreateLibroDto } from "../models/libro-create-dto.model";
import { ApiResponse } from "../models/apiResponse.model";

@Injectable({
    providedIn: 'root'
})
export class LibrosService {
    private baseUrl = environment.baseUrl;
    private http = inject(HttpClient);
    
    private toStr = (v: unknown) => (v === undefined || v === null ? '' : String(v));
    private toNumStr = (v: number | undefined | null) => Number.isFinite(v as number) ? String(v) : '0';
    private toBoolStr = (v: boolean | undefined | null) => v ? 'true' : 'false';


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

    createNewLibro(dto: CreateLibroDto) {
      const fd = this.toLibroFormData(dto);
      return this.http
        .post<ApiResponse<string>>(`${this.baseUrl}Libros`, fd)
        .pipe(map(r => {
          console.log('Respuesta del backend:', r);
          return r.data;
        }));
    }

    updateLibro(id: string, dto: CreateLibroDto) {
      const fd = this.toLibroFormData(dto);

      return this.http
        .put<ApiResponse<string>>(`${this.baseUrl}Libros/${encodeURIComponent(id)}`, fd)
        .pipe(
          map(r => {
            console.log('Respuesta al actualizar el libro:', r);
            return r.data;
          })
        );
    }

    deleteLibro(id: string) {
      return this.http
        .delete<ApiResponse<string>>(`${this.baseUrl}Libros/${encodeURIComponent(id)}`)
        .pipe(
          map(r => {
            console.log('Respuesta al eliminar libro:', r);
            return r.data;
          })
        );
    }

    private toLibroFormData(dto: CreateLibroDto): FormData {
      const fd = new FormData();
      fd.append('Titulo', this.toStr(dto.titulo));
      fd.append('Autor', this.toStr(dto.autor));
      fd.append('Description', this.toStr(dto.description));
      fd.append('ExtendedDescription', this.toStr(dto.extendedDescription));
      fd.append('UnitPrice', this.toNumStr(dto.unitPrice));
      fd.append('GenreId', this.toNumStr(dto.genreId));
      fd.append('ISBN', this.toStr(dto.isbn));
      fd.append('Disponible', this.toBoolStr(dto.disponible));
      if (dto.image) fd.append('Image', dto.image, dto.image.name); // preserva filename
      return fd;
    }
}