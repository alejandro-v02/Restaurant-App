import { Injectable } from '@angular/core';
import {
  EventoItemEstado,
  EventoItemListo,
  EventoMesaActualizada,
  EventoProductoDisponibilidad,
  RealtimePort
} from '@shared';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpRealtimeService implements RealtimePort {
  private socket: Socket | null = null;

  private mesaActualizada$ = new Subject<EventoMesaActualizada>();
  private itemEstado$ = new Subject<EventoItemEstado>();
  private itemListo$ = new Subject<EventoItemListo>();
  private productoDisponibilidad$ = new Subject<EventoProductoDisponibilidad>();

  conectar(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(environment.wsUrl, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('mesa:actualizada', (data: EventoMesaActualizada) => {
      this.mesaActualizada$.next(data);
    });

    this.socket.on('item:estado', (data: EventoItemEstado) => {
      this.itemEstado$.next(data);
    });

    this.socket.on('item:listo', (data: EventoItemListo) => {
      this.itemListo$.next(data);
    });

    this.socket.on('producto:disponibilidad', (data: EventoProductoDisponibilidad) => {
      this.productoDisponibilidad$.next(data);
    });
  }

  desconectar(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
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
}
