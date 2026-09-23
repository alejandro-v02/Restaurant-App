import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthPort, Mesero, Sesion } from '@shared';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';

const SESION_STORAGE_KEY = 'fogonpos_sesion';
const MAX_INTENTOS_FALLIDOS = 5;
const TIEMPO_BLOQUEO_SEGUNDOS = 30;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authPort = inject(AuthPort);
  private router = inject(Router);

  // Estados Reactivos con Signals
  readonly sesion = signal<Sesion | null>(null);
  readonly inicializado = signal(false);
  readonly intentosFallidos = signal(0);
  readonly segundosRestantesBloqueo = signal(0);

  readonly estaAutenticado = computed(() => {
    const s = this.sesion();
    if (!s) return false;
    return new Date(s.expiraEn).getTime() > Date.now();
  });

  readonly meseroActual = computed(() => this.sesion()?.mesero ?? null);
  readonly estaBloqueado = computed(() => this.segundosRestantesBloqueo() > 0);

  private timerBloqueo: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.inicializarSesion();
  }

  /**
   * Restaura la sesión desde @capacitor/preferences si existe y está vigente.
   */
  async inicializarSesion(): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key: SESION_STORAGE_KEY });
      if (value) {
        const sesionGuardada: Sesion = JSON.parse(value);
        const expiraMs = new Date(sesionGuardada.expiraEn).getTime();

        if (expiraMs > Date.now()) {
          this.sesion.set(sesionGuardada);
          this.inicializado.set(true);
          return true;
        } else {
          // Sesión expirada
          await Preferences.remove({ key: SESION_STORAGE_KEY });
        }
      }
    } catch (err) {
      console.error('Error al inicializar sesión desde Preferences:', err);
    }

    this.sesion.set(null);
    this.inicializado.set(true);
    return false;
  }

  meserosDelTurno(): Observable<Mesero[]> {
    return this.authPort.meserosDelTurno();
  }

  loginPin(meseroId: string, pin: string): Observable<Sesion> {
    if (this.estaBloqueado()) {
      return throwError(() => new Error(`Acceso bloqueado. Espera ${this.segundosRestantesBloqueo()}s.`));
    }

    return this.authPort.loginPin(meseroId, pin).pipe(
      tap(async (nuevaSesion) => {
        this.sesion.set(nuevaSesion);
        this.intentosFallidos.set(0);
        await Preferences.set({
          key: SESION_STORAGE_KEY,
          value: JSON.stringify(nuevaSesion)
        });
      }),
      catchError((error: unknown) => {
        this.registrarIntentoFallido();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return this.authPort.logout().pipe(
      switchMap(async () => {
        await this.limpiarSesionLocal();
      }),
      catchError(async () => {
        await this.limpiarSesionLocal();
      })
    );
  }

  async limpiarSesionLocal(): Promise<void> {
    this.sesion.set(null);
    await Preferences.remove({ key: SESION_STORAGE_KEY });
    this.router.navigate(['/login']);
  }

  private registrarIntentoFallido(): void {
    const nuevosIntentos = this.intentosFallidos() + 1;
    this.intentosFallidos.set(nuevosIntentos);

    if (nuevosIntentos >= MAX_INTENTOS_FALLIDOS) {
      this.iniciarBloqueo(TIEMPO_BLOQUEO_SEGUNDOS);
    }
  }

  private iniciarBloqueo(segundos: number): void {
    this.segundosRestantesBloqueo.set(segundos);

    if (this.timerBloqueo) {
      clearInterval(this.timerBloqueo);
    }

    this.timerBloqueo = setInterval(() => {
      const restantes = this.segundosRestantesBloqueo() - 1;
      if (restantes <= 0) {
        this.segundosRestantesBloqueo.set(0);
        this.intentosFallidos.set(0);
        if (this.timerBloqueo) {
          clearInterval(this.timerBloqueo);
          this.timerBloqueo = null;
        }
      } else {
        this.segundosRestantesBloqueo.set(restantes);
      }
    }, 1000);
  }
}
