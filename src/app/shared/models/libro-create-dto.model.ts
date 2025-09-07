export interface CreateLibroDto {
    titulo: string;
    autor: string;
    description?: string;
    extendedDescription?: string;
    unitPrice: number;
    genreId: number;
    image?: File | null;   // binary file
    isbn: string;
    disponible: boolean;
}