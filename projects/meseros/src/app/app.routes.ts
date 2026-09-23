import { Routes } from '@angular/router';
import { authGuard } from './core/auth';
import { LoginPinComponent } from './features/login-pin/login-pin.component';
import { MisMesasComponent } from './features/mis-mesas/mis-mesas-placeholder.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPinComponent
  },
  {
    path: 'mesas',
    component: MisMesasComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'mesas',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'mesas'
  }
];
