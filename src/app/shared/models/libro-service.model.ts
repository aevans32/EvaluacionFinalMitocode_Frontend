import { Libro } from "./libro.model";

export interface HomeApiResponse {
    data: Libro[];
  success: boolean;
  errorMessage: string | null;
}

