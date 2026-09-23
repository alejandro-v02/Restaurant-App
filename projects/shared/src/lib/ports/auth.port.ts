import { Observable } from 'rxjs';
import { Mesero, Sesion } from '../models';

export abstract class AuthPort {
  abstract meserosDelTurno(): Observable<Mesero[]>;
  abstract loginPin(meseroId: string, pin: string): Observable<Sesion>;
  abstract logout(): Observable<void>;
}
