export type TipoImpuesto = 'INC_8' | 'IVA_19' | 'EXCLUIDO';

export interface Categoria {
  id: string;
  nombre: string;
  orden: number;
}

export interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  impuesto: TipoImpuesto;
}
