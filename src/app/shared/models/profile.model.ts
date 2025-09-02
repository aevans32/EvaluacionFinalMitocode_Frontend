export interface LibroAlquiladoResponse {
  pedidoId: string;
  fechaPedido: string;
  fechaEntrega: string | null;
  estado: boolean;
  libroId: string;
  titulo: string;
  isbn: string;
  imageUrl: string;
  cantidad: number;
  precioUnitario: number;
  subTotal: number;
}
