import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mesa, MesasPort } from '@shared';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-mis-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-mesas-placeholder.component.html',
  styleUrls: ['./mis-mesas-placeholder.component.scss']
})
export class MisMesasComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private mesasPort = inject(MesasPort);

  readonly cargando = signal(true);
  readonly mesas = signal<Mesa[]>([]);

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.cargando.set(true);
    this.mesasPort.misMesas().subscribe({
      next: (data) => {
        this.mesas.set(data);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando mesas del mesero:', err);
        this.cargando.set(false);
      }
    });
  }

  formatearEstadoMesa(estado: Mesa['estado']): string {
    switch (estado) {
      case 'LIBRE': return 'Libre';
      case 'OCUPADA': return 'Ocupada';
      case 'ESPERANDO_COMIDA': return 'Esperando Comida';
      case 'PIDIO_CUENTA': return 'Pidió Cuenta';
      default: return estado;
    }
  }
}
