import { Injectable } from '@angular/core';
import { AuthPort, Mesero, Sesion } from '@shared';
import { Observable, throwError } from 'rxjs';
import { MOCK_MESEROS } from './mock-data';
import { mockDelay } from './mock-utils';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService implements AuthPort {
  private meseroActualId: string | null = null;

  meserosDelTurno(): Observable<Mesero[]> {
    const meseros: Mesero[] = MOCK_MESEROS.map(({ id, nombre, avatarColor }) => ({
      id,
      nombre,
      avatarColor
    }));
    return mockDelay(meseros);
  }

  loginPin(meseroId: string, pin: string): Observable<Sesion> {
    const mesero = MOCK_MESEROS.find(m => m.id === meseroId);
    if (!mesero) {
      return throwError(() => new Error('Mesero no encontrado'));
    }

    if (mesero.pin !== pin) {
      return throwError(() => new Error('PIN incorrecto'));
    }

    this.meseroActualId = mesero.id;

    // Token simulado y expiración en 12 horas
    const expiraEn = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
    const sesion: Sesion = {
      token: `mock-jwt-token-${mesero.id}-${Date.now()}`,
      mesero: {
        id: mesero.id,
        nombre: mesero.nombre,
        avatarColor: mesero.avatarColor
      },
      expiraEn
    };

    return mockDelay(sesion);
  }

  logout(): Observable<void> {
    this.meseroActualId = null;
    return mockDelay(undefined);
  }

  getMeseroActualId(): string | null {
    return this.meseroActualId;
  }
}
