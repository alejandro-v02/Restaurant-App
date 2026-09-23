import { Injectable, inject } from '@angular/core';
import { ItemPedido, Pedido, PedidosPort, SolicitudCuenta } from '@shared';
import { Observable, of, throwError } from 'rxjs';
import { mockDelay } from './mock-utils';
import { MockRealtimeService } from './mock-realtime.service';

@Injectable({
  providedIn: 'root'
})
export class MockPedidosService implements PedidosPort {
  private realtime = inject(MockRealtimeService);
  private pedidosEnMemoria = new Map<string, Pedido>();

  // Pedidos de prueba preexistentes para mesas ocupadas
  constructor() {
    this.inicializarPedidosPrueba();
  }

  private inicializarPedidosPrueba(): void {
    // Pedido activo para Mesa 2 (Carlos)
    this.pedidosEnMemoria.set('ped-2', {
      id: 'ped-2',
      mesaId: 'mesa-2',
      meseroId: 'm1',
      comensales: 2,
      creadoEn: new Date(Date.now() - 45 * 60000).toISOString(),
      items: [
        {
          id: 'item-2-1',
          productoId: 'prod-1',
          nombre: 'Empanadas de Carne (x3)',
          precioUnitario: 14000,
          cantidad: 1,
          notas: 'Con ají extra',
          comensal: 1,
          estado: 'ENTREGADO'
        },
        {
          id: 'item-2-2',
          productoId: 'prod-5',
          nombre: 'Mamona Llanera Tradicional (500g)',
          precioUnitario: 48000,
          cantidad: 1,
          notas: 'Término medio',
          comensal: 2,
          estado: 'ENTREGADO'
        }
      ]
    });

    // Pedido activo para Mesa 3 (Carlos - Esperando comida)
    this.pedidosEnMemoria.set('ped-3', {
      id: 'ped-3',
      mesaId: 'mesa-3',
      meseroId: 'm1',
      comensales: 4,
      creadoEn: new Date(Date.now() - 25 * 60000).toISOString(),
      items: [
        {
          id: 'item-3-1',
          productoId: 'prod-7',
          nombre: 'Punta de Anca al Carbón (400g)',
          precioUnitario: 52000,
          cantidad: 2,
          notas: 'Término 3/4',
          comensal: 1,
          estado: 'PREPARANDO'
        },
        {
          id: 'item-3-2',
          productoId: 'prod-18',
          nombre: 'Limonada de Panela Frappé',
          precioUnitario: 7500,
          cantidad: 3,
          notas: 'Bien frías',
          comensal: 2,
          estado: 'LISTO'
        }
      ]
    });

    // Pedido activo para Mesa 4 (Carlos - Pidió cuenta)
    this.pedidosEnMemoria.set('ped-4', {
      id: 'ped-4',
      mesaId: 'mesa-4',
      meseroId: 'm1',
      comensales: 2,
      creadoEn: new Date(Date.now() - 60 * 60000).toISOString(),
      items: [
        {
          id: 'item-4-1',
          productoId: 'prod-8',
          nombre: 'Churrasco Criollo (400g)',
          precioUnitario: 49000,
          cantidad: 2,
          notas: '',
          comensal: 1,
          estado: 'ENTREGADO'
        },
        {
          id: 'item-4-2',
          productoId: 'prod-23',
          nombre: 'Cerveza Club Colombia / Águila',
          precioUnitario: 8500,
          cantidad: 2,
          notas: '',
          comensal: 2,
          estado: 'ENTREGADO'
        }
      ]
    });

    // Pedido activo para Mesa 6 (Luisa)
    this.pedidosEnMemoria.set('ped-6', {
      id: 'ped-6',
      mesaId: 'mesa-6',
      meseroId: 'm2',
      comensales: 3,
      creadoEn: new Date(Date.now() - 30 * 60000).toISOString(),
      items: [
        {
          id: 'item-6-1',
          productoId: 'prod-6',
          nombre: 'Ternera a la Llanera Especial',
          precioUnitario: 45000,
          cantidad: 2,
          notas: 'Papa salada bien cocida',
          comensal: 1,
          estado: 'ENTREGADO'
        }
      ]
    });
  }

  obtener(pedidoId: string): Observable<Pedido> {
    const pedido = this.pedidosEnMemoria.get(pedidoId);
    if (!pedido) {
      return throwError(() => new Error(`Pedido no encontrado: ${pedidoId}`));
    }
    return mockDelay(JSON.parse(JSON.stringify(pedido)));
  }

  registrarPedido(pedido: Pedido): void {
    this.pedidosEnMemoria.set(pedido.id, pedido);
  }

  agregarItems(pedidoId: string, items: ItemPedido[], _idLocal?: string): Observable<Pedido> {
    const pedido = this.pedidosEnMemoria.get(pedidoId);
    if (!pedido) {
      return throwError(() => new Error(`Pedido no encontrado: ${pedidoId}`));
    }

    const itemsActualizados = [...pedido.items, ...items];
    const pedidoActualizado: Pedido = {
      ...pedido,
      items: itemsActualizados
    };

    this.pedidosEnMemoria.set(pedidoId, pedidoActualizado);
    return mockDelay(JSON.parse(JSON.stringify(pedidoActualizado)));
  }

  enviarACocina(pedidoId: string, mesaNumero = 1): Observable<Pedido> {
    const pedido = this.pedidosEnMemoria.get(pedidoId);
    if (!pedido) {
      return throwError(() => new Error(`Pedido no encontrado: ${pedidoId}`));
    }

    const itemsAEnviar = pedido.items.filter(i => i.estado === 'BORRADOR');
    const itemsActualizados = pedido.items.map(item => {
      if (item.estado === 'BORRADOR') {
        return { ...item, estado: 'ENVIADO' as const };
      }
      return item;
    });

    const pedidoActualizado: Pedido = {
      ...pedido,
      items: itemsActualizados
    };
    this.pedidosEnMemoria.set(pedidoId, pedidoActualizado);

    // Activar ciclo simulado en tiempo real en la cocina
    if (itemsAEnviar.length > 0) {
      this.realtime.simularCocina(
        pedidoId,
        mesaNumero,
        itemsAEnviar.map(i => ({ id: i.id, nombre: i.nombre }))
      );
    }

    return mockDelay(JSON.parse(JSON.stringify(pedidoActualizado)));
  }

  marcarEntregado(pedidoId: string, itemId: string): Observable<Pedido> {
    const pedido = this.pedidosEnMemoria.get(pedidoId);
    if (!pedido) {
      return throwError(() => new Error(`Pedido no encontrado: ${pedidoId}`));
    }

    const itemsActualizados = pedido.items.map(item => {
      if (item.id === itemId) {
        return { ...item, estado: 'ENTREGADO' as const };
      }
      return item;
    });

    const pedidoActualizado: Pedido = {
      ...pedido,
      items: itemsActualizados
    };
    this.pedidosEnMemoria.set(pedidoId, pedidoActualizado);

    return mockDelay(JSON.parse(JSON.stringify(pedidoActualizado)));
  }

  solicitarCuenta(_solicitud: SolicitudCuenta): Observable<{ ok: boolean }> {
    return mockDelay({ ok: true });
  }
}
