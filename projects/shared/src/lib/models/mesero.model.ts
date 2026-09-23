export type Rol = 'ADMIN' | 'CAJERO' | 'COCINA' | 'MESERO';

export interface Mesero {
  id: string;
  nombre: string;
  avatarColor: string;
}

export interface Sesion {
  token: string;
  mesero: Mesero;
  expiraEn: string;
}
