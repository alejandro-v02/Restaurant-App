import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './ui/top-bar/top-bar.component';
import { environment } from '../environments/environment';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly authService = inject(AuthService);
  readonly env = environment;

  onCerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Redirigido automáticamente a /login por authService
      },
      error: () => {
        // En caso de fallo de red, authService limpia sesión local de todos modos
      }
    });
  }
}
