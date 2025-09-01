import { Libro } from "./libro";

export interface HomeApiResponse {
    libros: Libro[];
    success: boolean;
    errorMessage: string;
}