import { Libro } from "./libro";

export interface HomeApiResponse {
    data: Libro[];
  success: boolean;
  errorMessage: string | null;
}