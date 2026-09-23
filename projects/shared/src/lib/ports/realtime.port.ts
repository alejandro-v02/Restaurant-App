import { Observable } from 'rxjs';
import { Mesa, EstadoItem } from '../models';

export interface EventoMesaActualizada {
  mesa: Mesa;
}

export interface EventoItemEstado {
  pedidoId: string;
  itemId: string;
  estado: EstadoItem;
}

export interface EventoItemListo {
  pedidoId: string;
  mesaNumero: number;
  itemNombre: string;
}

export interface EventoProductoDisponibilidad {
  productoId: string;
  disponible: boolean;
}

export abstract class RealtimePort {
  abstract conectar(token: string): void;
  abstract desconectar(): void;
  abstract onMesaActualizada(): Observable<EventoMesaActualizada>;
  abstract onItemEstado(): Observable<EventoItemEstado>;
  abstract onItemListo(): Observable<EventoItemListo>;
  abstract onProductoDisponibilidad(): Observable<EventoProductoDisponibilidad>;
}
