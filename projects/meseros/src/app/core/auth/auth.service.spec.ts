import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthPort } from '@shared';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { MockAuthService } from '../data/mock';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    await Preferences.clear();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: AuthPort,
          useClass: MockAuthService
        }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(async () => {
    await Preferences.clear();
  });

  it('debe crearse correctamente sin sesión activa', () => {
    expect(service).toBeTruthy();
    expect(service.estaAutenticado()).toBe(false);
  });

  it('debe autenticar con éxito a Luisa con PIN 1234', async () => {
    const sesion = await firstValueFrom(service.loginPin('m2', '1234'));
    expect(sesion).toBeTruthy();
    expect(sesion.mesero.nombre).toBe('Luisa');
    expect(service.estaAutenticado()).toBe(true);
    expect(service.meseroActual()?.nombre).toBe('Luisa');
  });

  it('debe rechazar PIN erróneo e incrementar intentos fallidos', async () => {
    try {
      await firstValueFrom(service.loginPin('m2', '9999'));
      throw new Error('Debió fallar');
    } catch (err: unknown) {
      expect((err as Error).message).toContain('PIN incorrecto');
      expect(service.intentosFallidos()).toBe(1);
      expect(service.estaAutenticado()).toBe(false);
    }
  });

  it('debe bloquear tras 5 intentos fallidos', () => {
    for (let i = 0; i < 5; i++) {
      service.loginPin('m2', '0000').subscribe({
        error: () => {}
      });
    }

    expect(service.intentosFallidos()).toBe(5);
    expect(service.estaBloqueado()).toBe(true);
    expect(service.segundosRestantesBloqueo()).toBeGreaterThan(0);
  });

  it('debe limpiar la sesión y redirigir al login al hacer logout', async () => {
    await firstValueFrom(service.loginPin('m2', '1234'));
    expect(service.estaAutenticado()).toBe(true);

    await firstValueFrom(service.logout());
    expect(service.estaAutenticado()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
