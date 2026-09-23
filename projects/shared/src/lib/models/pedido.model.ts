export type EstadoItem = 'BORRADOR' | 'ENVIADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO';

export interface ItemPedido {
  id: string;
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  notas: string;
  comensal: number;
  estado: EstadoItem;
}

export interface Pedido {
  id: string;
  mesaId: string;
  meseroId: string;
  comensales: number;
  items: ItemPedido[];
  creadoEn: string;
}
