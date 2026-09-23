import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemPedido, Pedido, PedidosPort, SolicitudCuenta } from '@shared';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpPedidosService implements PedidosPort {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  obtener(pedidoId: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/pedidos/${pedidoId}`);
  }

  agregarItems(pedidoId: string, items: ItemPedido[], idLocal?: string): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/pedidos/${pedidoId}/items`, {
      items,
      idLocal: idLocal || crypto.randomUUID()
    });
  }

  enviarACocina(pedidoId: string): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/pedidos/${pedidoId}/enviar-cocina`, {});
  }

  marcarEntregado(pedidoId: string, itemId: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/pedidos/${pedidoId}/items/${itemId}/entregado`, {});
  }

  solicitarCuenta(solicitud: SolicitudCuenta): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      `${this.baseUrl}/pedidos/${solicitud.pedidoId}/solicitar-cuenta`,
      solicitud
    );
  }
}
