import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-numeric-keypad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './numeric-keypad.component.html',
  styleUrls: ['./numeric-keypad.component.scss']
})
export class NumericKeypadComponent {
  @Input() deshabilitado = false;
  @Output() digito = new EventEmitter<string>();
  @Output() borrar = new EventEmitter<void>();
  @Output() limpiar = new EventEmitter<void>();

  readonly teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  async presionarDigito(num: string): Promise<void> {
    if (this.deshabilitado) return;
    await this.emitirVibracion();
    this.digito.emit(num);
  }

  async presionarBorrar(): Promise<void> {
    if (this.deshabilitado) return;
    await this.emitirVibracion();
    this.borrar.emit();
  }

  async presionarLimpiar(): Promise<void> {
    if (this.deshabilitado) return;
    await this.emitirVibracion();
    this.limpiar.emit();
  }

  private async emitirVibracion(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Ignorar de manera silenciosa si se ejecuta en navegador web de escritorio
    }
  }
}
