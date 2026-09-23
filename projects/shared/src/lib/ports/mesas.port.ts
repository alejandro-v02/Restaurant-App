import { Observable } from 'rxjs';
import { Mesa, Pedido } from '../models';

export abstract class MesasPort {
  abstract misMesas(): Observable<Mesa[]>;
  abstract abrirMesa(mesaId: string, comensales: number): Observable<Pedido>;
}
