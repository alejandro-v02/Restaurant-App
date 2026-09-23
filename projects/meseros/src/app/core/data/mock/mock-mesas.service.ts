import { Injectable, inject } from '@angular/core';
import { Mesa, MesasPort, Pedido } from '@shared';
import { Observable, throwError } from 'rxjs';
import { MOCK_MESAS_INICIALES } from './mock-data';
import { mockDelay } from './mock-utils';
import { MockAuthService } from './mock-auth.service';
import { MockRealtimeService } from './mock-realtime.service';
import { MockPedidosService } from './mock-pedidos.service';

@Injectable({
  providedIn: 'root'
})
export class MockMesasService implements MesasPort {
  private auth = inject(MockAuthService);
  private realtime = inject(MockRealtimeService);
  private pedidos = inject(MockPedidosService);

  private mesasEnMemoria: Mesa[] = JSON.parse(JSON.stringify(MOCK_MESAS_INICIALES));

  misMesas(): Observable<Mesa[]> {
    // Si hay un mesero autenticado en MockAuthService, filtramos por su ID; de lo contrario por defecto Carlos ('m1')
    const meseroId = this.auth.getMeseroActualId() || 'm1';
    const misMesas = this.mesasEnMemoria.filter(m => m.meseroId === meseroId);
    return mockDelay(JSON.parse(JSON.stringify(misMesas)));
  }

  todasLasMesas(): Observable<Mesa[]> {
    return mockDelay(JSON.parse(JSON.stringify(this.mesasEnMemoria)));
  }

  abrirMesa(mesaId: string, comensales: number): Observable<Pedido> {
    const mesa = this.mesasEnMemoria.find(m => m.id === mesaId);
    if (!mesa) {
      return throwError(() => new Error(`Mesa no encontrada: ${mesaId}`));
    }

    const nuevoPedidoId = `ped-${Date.now()}`;
    const nuevoPedido: Pedido = {
      id: nuevoPedidoId,
      mesaId: mesa.id,
      meseroId: mesa.meseroId,
      comensales,
      items: [],
      creadoEn: new Date().toISOString()
    };

    // Registrar pedido en memoria
    this.pedidos.registrarPedido(nuevoPedido);

    // Actualizar estado de la mesa
    mesa.estado = 'OCUPADA';
    mesa.pedidoActivoId = nuevoPedidoId;
    mesa.abiertaDesde = new Date().toISOString();

    // Notificar en tiempo real
    this.realtime.emitirMesaActualizada(JSON.parse(JSON.stringify(mesa)));

    return mockDelay(nuevoPedido);
  }

  actualizarEstadoMesa(mesaId: string, nuevoEstado: Mesa['estado']): void {
    const mesa = this.mesasEnMemoria.find(m => m.id === mesaId);
    if (mesa) {
      mesa.estado = nuevoEstado;
      this.realtime.emitirMesaActualizada(JSON.parse(JSON.stringify(mesa)));
    }
  }
}
