import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthPort, CatalogoPort, MesasPort, PedidosPort, RealtimePort } from '@shared';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Mocks
import {
  MockAuthService,
  MockCatalogoService,
  MockMesasService,
  MockPedidosService,
  MockRealtimeService
} from './core/data/mock';

// Http
import {
  HttpAuthService,
  HttpCatalogoService,
  HttpMesasService,
  HttpPedidosService,
  HttpRealtimeService
} from './core/data/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    // Inyección de dependencias hexagonal (puertos -> adaptadores)
    {
      provide: AuthPort,
      useClass: environment.useMocks ? MockAuthService : HttpAuthService
    },
    {
      provide: MesasPort,
      useClass: environment.useMocks ? MockMesasService : HttpMesasService
    },
    {
      provide: CatalogoPort,
      useClass: environment.useMocks ? MockCatalogoService : HttpCatalogoService
    },
    {
      provide: PedidosPort,
      useClass: environment.useMocks ? MockPedidosService : HttpPedidosService
    },
    {
      provide: RealtimePort,
      useClass: environment.useMocks ? MockRealtimeService : HttpRealtimeService
    }
  ]
};
