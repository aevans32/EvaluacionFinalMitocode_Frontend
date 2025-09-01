export interface Libro {
    id: string;
    titulo: string;
    autor: string;
    description: string;
    extendedDescription: string;
    unitPrice: number;
    genreId: number;
    imageUrl: string | null;
    isbn: string;
    disponible: boolean;
    activeStatus: boolean;
}