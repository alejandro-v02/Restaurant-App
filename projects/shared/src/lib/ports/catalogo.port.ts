import { Observable } from 'rxjs';
import { Categoria, Producto } from '../models';

export abstract class CatalogoPort {
  abstract categorias(): Observable<Categoria[]>;
  abstract productos(): Observable<Producto[]>;
}
