export type TipoDocumento = 'TIQUETE_POS' | 'FACTURA_ELECTRONICA';

export type TipoIdentificacion = 'CC' | 'NIT' | 'CE' | 'PASAPORTE';

export interface DatosCliente {
  tipoId: TipoIdentificacion;
  numeroId: string;
  nombre: string;
  correo: string;
}
