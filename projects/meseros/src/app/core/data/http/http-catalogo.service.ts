import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatalogoPort, Categoria, Producto } from '@shared';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpCatalogoService implements CatalogoPort {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  categorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/catalogo/categorias`);
  }

  productos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/catalogo/productos`);
  }
}
