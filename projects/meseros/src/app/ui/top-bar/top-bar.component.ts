import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() titulo = 'FogónPOS';
  @Input() subtitulo = 'Meseros';
  @Input() meseroNombre: string | null = null;
  @Input() meseroColor: string | null = null;
  @Input() useMocks = true;
  @Input() mostrarCerrarSesion = false;

  @Output() cerrarSesion = new EventEmitter<void>();

  onCerrarSesion(): void {
    this.cerrarSesion.emit();
  }
}
