import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthPort, CatalogoPort, Mesa, MesasPort, Mesero } from '@shared';
import { TopBarComponent } from './ui/top-bar/top-bar.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private authPort = inject(AuthPort);
  private mesasPort = inject(MesasPort);
  private catalogoPort = inject(CatalogoPort);

  readonly env = environment;
  readonly cargando = signal(true);
  readonly meseros = signal<Mesero[]>([]);
  readonly mesas = signal<Mesa[]>([]);
  readonly numCategorias = signal(0);
  readonly numProductos = signal(0);
  readonly meseroActivo = signal<Mesero | null>(null);

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.cargando.set(true);

    // Comprobar AuthPort
    this.authPort.meserosDelTurno().subscribe({
      next: (meserosList) => {
        this.meseros.set(meserosList);
        if (meserosList.length > 0) {
          this.meseroActivo.set(meserosList[0]);
        }
      },
      error: (err: unknown) => {
        console.error('Error cargando meseros del turno:', err);
      }
    });

    // Comprobar MesasPort
    this.mesasPort.misMesas().subscribe({
      next: (mesasList) => {
        this.mesas.set(mesasList);
      },
      error: (err: unknown) => {
        console.error('Error cargando mesas:', err);
      }
    });

    // Comprobar CatalogoPort
    this.catalogoPort.categorias().subscribe({
      next: (cats) => {
        this.numCategorias.set(cats.length);
      }
    });

    this.catalogoPort.productos().subscribe({
      next: (prods) => {
        this.numProductos.set(prods.length);
        this.cargando.set(false);
      }
    });
  }

  seleccionarMesero(mesero: Mesero): void {
    this.meseroActivo.set(mesero);
  }

  formatearEstadoMesa(estado: Mesa['estado']): string {
    switch (estado) {
      case 'LIBRE':
        return 'Libre';
      case 'OCUPADA':
        return 'Ocupada';
      case 'ESPERANDO_COMIDA':
        return 'Esperando Comida';
      case 'PIDIO_CUENTA':
        return 'Pidió Cuenta';
      default:
        return estado;
    }
  }
}
