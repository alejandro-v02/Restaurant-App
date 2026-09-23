export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'ESPERANDO_COMIDA' | 'PIDIO_CUENTA';

export interface Mesa {
  id: string;
  numero: number;
  zona: string;
  capacidad: number;
  estado: EstadoMesa;
  meseroId: string;
  pedidoActivoId: string | null;
  abiertaDesde: string | null;
}
