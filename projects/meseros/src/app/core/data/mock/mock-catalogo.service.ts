import { Injectable } from '@angular/core';
import { CatalogoPort, Categoria, Producto } from '@shared';
import { Observable } from 'rxjs';
import { MOCK_CATEGORIAS, MOCK_PRODUCTOS } from './mock-data';
import { mockDelay } from './mock-utils';

@Injectable({
  providedIn: 'root'
})
export class MockCatalogoService implements CatalogoPort {
  private productosEnMemoria: Producto[] = [...MOCK_PRODUCTOS];

  categorias(): Observable<Categoria[]> {
    return mockDelay([...MOCK_CATEGORIAS]);
  }

  productos(): Observable<Producto[]> {
    return mockDelay([...this.productosEnMemoria]);
  }

  actualizarDisponibilidad(productoId: string, disponible: boolean): void {
    const idx = this.productosEnMemoria.findIndex(p => p.id === productoId);
    if (idx !== -1) {
      this.productosEnMemoria[idx] = {
        ...this.productosEnMemoria[idx],
        disponible
      };
    }
  }
}
