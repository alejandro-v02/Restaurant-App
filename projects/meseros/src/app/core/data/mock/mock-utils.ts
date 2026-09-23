import { Observable, delay, of } from 'rxjs';

/**
 * Simula latencia de red aleatoria entre 300ms y 800ms
 */
export function mockDelay<T>(data: T): Observable<T> {
  const ms = Math.floor(Math.random() * (800 - 300 + 1)) + 300;
  return of(data).pipe(delay(ms));
}
