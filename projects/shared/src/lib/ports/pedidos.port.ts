import { Observable } from 'rxjs';
import { Pedido, ItemPedido } from '../models';
import { SolicitudCuenta } from '../models/solicitud-cuenta.model';

export abstract class PedidosPort {
  abstract obtener(pedidoId: string): Observable<Pedido>;
  abstract agregarItems(pedidoId: string, items: ItemPedido[], idLocal?: string): Observable<Pedido>;
  abstract enviarACocina(pedidoId: string): Observable<Pedido>;
  abstract marcarEntregado(pedidoId: string, itemId: string): Observable<Pedido>;
  abstract solicitarCuenta(solicitud: SolicitudCuenta): Observable<{ ok: boolean }>;
}
