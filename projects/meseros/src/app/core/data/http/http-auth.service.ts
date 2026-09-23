import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthPort, Mesero, Sesion } from '@shared';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthService implements AuthPort {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  meserosDelTurno(): Observable<Mesero[]> {
    return this.http.get<Mesero[]>(`${this.baseUrl}/auth/meseros-turno`);
  }

  loginPin(meseroId: string, pin: string): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.baseUrl}/auth/login-pin`, { meseroId, pin });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }
}
