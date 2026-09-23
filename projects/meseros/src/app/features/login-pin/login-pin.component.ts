import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Mesero } from '@shared';
import { AuthService } from '../../core/auth/auth.service';
import { NumericKeypadComponent } from '../../ui/numeric-keypad/numeric-keypad.component';

type VistaLogin = 'SELECCION_MESERO' | 'INGRESO_PIN';

@Component({
  selector: 'app-login-pin',
  standalone: true,
  imports: [CommonModule, NumericKeypadComponent],
  templateUrl: './login-pin.component.html',
  styleUrls: ['./login-pin.component.scss']
})
export class LoginPinComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private router = inject(Router);

  readonly vista = signal<VistaLogin>('SELECCION_MESERO');
  readonly meseros = signal<Mesero[]>([]);
  readonly cargandoMeseros = signal(true);
  readonly meseroSeleccionado = signal<Mesero | null>(null);

  readonly pin = signal<string>('');
  readonly validando = signal<boolean>(false);
  readonly errorMensaje = signal<string | null>(null);
  readonly sacudir = signal<boolean>(false);

  readonly puntosPin = [0, 1, 2, 3];

  async ngOnInit(): Promise<void> {
    // Si ya hay una sesión guardada vigente, entrar directo
    if (!this.authService.inicializado()) {
      const tieneSesion = await this.authService.inicializarSesion();
      if (tieneSesion) {
        this.router.navigate(['/mesas']);
        return;
      }
    } else if (this.authService.estaAutenticado()) {
      this.router.navigate(['/mesas']);
      return;
    }

    this.cargarMeseros();
  }

  cargarMeseros(): void {
    this.cargandoMeseros.set(true);
    this.authService.meserosDelTurno().subscribe({
      next: (data) => {
        this.meseros.set(data);
        this.cargandoMeseros.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando meseros del turno:', err);
        this.cargandoMeseros.set(false);
      }
    });
  }

  seleccionarMesero(mesero: Mesero): void {
    this.meseroSeleccionado.set(mesero);
    this.pin.set('');
    this.errorMensaje.set(null);
    this.vista.set('INGRESO_PIN');
  }

  cambiarMesero(): void {
    this.meseroSeleccionado.set(null);
    this.pin.set('');
    this.errorMensaje.set(null);
    this.vista.set('SELECCION_MESERO');
  }

  onDigito(d: string): void {
    if (this.validando() || this.authService.estaBloqueado()) return;

    const actual = this.pin();
    if (actual.length < 4) {
      const nuevo = actual + d;
      this.pin.set(nuevo);
      this.errorMensaje.set(null);

      // Si se completaron los 4 dígitos, validar automáticamente
      if (nuevo.length === 4) {
        this.ejecutarLogin(nuevo);
      }
    }
  }

  onBorrar(): void {
    if (this.validando() || this.authService.estaBloqueado()) return;
    const actual = this.pin();
    if (actual.length > 0) {
      this.pin.set(actual.slice(0, -1));
      this.errorMensaje.set(null);
    }
  }

  onLimpiar(): void {
    if (this.validando() || this.authService.estaBloqueado()) return;
    this.pin.set('');
    this.errorMensaje.set(null);
  }

  private ejecutarLogin(pinCompleto: string): void {
    const mesero = this.meseroSeleccionado();
    if (!mesero) return;

    this.validando.set(true);

    this.authService.loginPin(mesero.id, pinCompleto).subscribe({
      next: () => {
        this.validando.set(false);
        this.router.navigate(['/mesas']);
      },
      error: (err: unknown) => {
        this.validando.set(false);
        this.activarAnimacionSacudida();
        this.pin.set('');

        if (this.authService.estaBloqueado()) {
          this.errorMensaje.set(
            `Demasiados intentos fallidos. Bloqueado por ${this.authService.segundosRestantesBloqueo()}s.`
          );
        } else {
          const mensaje = err instanceof Error ? err.message : 'PIN incorrecto';
          const intentosRestantes = 5 - this.authService.intentosFallidos();
          this.errorMensaje.set(`${mensaje}. Te quedan ${intentosRestantes} intento(s).`);
        }
      }
    });
  }

  private activarAnimacionSacudida(): void {
    this.sacudir.set(true);
    setTimeout(() => {
      this.sacudir.set(false);
    }, 500);
  }
}
