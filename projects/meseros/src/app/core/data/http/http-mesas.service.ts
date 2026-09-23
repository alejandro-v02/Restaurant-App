import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mesa, MesasPort, Pedido } from '@shared';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpMesasService implements MesasPort {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  misMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.baseUrl}/meseros/me/mesas`);
  }

  abrirMesa(mesaId: string, comensales: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/mesas/${mesaId}/abrir`, { comensales });
  }
}
