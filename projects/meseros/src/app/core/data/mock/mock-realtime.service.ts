import { Injectable } from '@angular/core';
import {
  EventoItemEstado,
  EventoItemListo,
  EventoMesaActualizada,
  EventoProductoDisponibilidad,
  Mesa,
  RealtimePort
} from '@shared';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockRealtimeService implements RealtimePort {
  private mesaActualizada$ = new Subject<EventoMesaActualizada>();
  private itemEstado$ = new Subject<EventoItemEstado>();
  private itemListo$ = new Subject<EventoItemListo>();
  private productoDisponibilidad$ = new Subject<EventoProductoDisponibilidad>();

  private tokenConectado: string | null = null;
  private timersCocina: ReturnType<typeof setTimeout>[] = [];

  conectar(token: string): void {
    this.tokenConectado = token;
  }

  desconectar(): void {
    this.tokenConectado = null;
    this.timersCocina.forEach(t => clearTimeout(t));
    this.timersCocina = [];
  }

  onMesaActualizada(): Observable<EventoMesaActualizada> {
    return this.mesaActualizada$.asObservable();
  }

  onItemEstado(): Observable<EventoItemEstado> {
    return this.itemEstado$.asObservable();
  }

  onItemListo(): Observable<EventoItemListo> {
    return this.itemListo$.asObservable();
  }

  onProductoDisponibilidad(): Observable<EventoProductoDisponibilidad> {
    return this.productoDisponibilidad$.asObservable();
  }

  // Emisores internos para simular cocina y eventos
  emitirMesaActualizada(mesa: Mesa): void {
    this.mesaActualizada$.next({ mesa });
  }

  emitirProductoDisponibilidad(productoId: string, disponible: boolean): void {
    this.productoDisponibilidad$.next({ productoId, disponible });
  }

  /**
   * Simula el ciclo de cocina:
   * 10 segundos después de enviar a cocina -> ítems pasan a PREPARANDO
   * 20 segundos después (total 30s desde envío) -> ítems pasan a LISTO (emitiendo item:listo)
   */
  simularCocina(pedidoId: string, mesaNumero: number, items: { id: string; nombre: string }[]): void {
    items.forEach(item => {
      // Paso a PREPARANDO a los 10 segundos
      const timerPreparando = setTimeout(() => {
        this.itemEstado$.next({
          pedidoId,
          itemId: item.id,
          estado: 'PREPARANDO'
        });

        // Paso a LISTO a los 20 segundos adicionales
        const timerListo = setTimeout(() => {
          this.itemEstado$.next({
            pedidoId,
            itemId: item.id,
            estado: 'LISTO'
          });

          this.itemListo$.next({
            pedidoId,
            mesaNumero,
            itemNombre: item.nombre
          });
        }, 20000);

        this.timersCocina.push(timerListo);
      }, 10000);

      this.timersCocina.push(timerPreparando);
    });
  }
}
