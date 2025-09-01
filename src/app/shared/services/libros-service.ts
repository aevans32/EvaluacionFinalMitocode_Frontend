import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { HomeApiResponse } from "../models/libro-service";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LibrosService {
    private baseUrl = environment.baseUrl + 'Libros/';
    private http = inject(HttpClient);

    getData() {
        return this.http.get<HomeApiResponse>(this.baseUrl + 'title');
    }
}