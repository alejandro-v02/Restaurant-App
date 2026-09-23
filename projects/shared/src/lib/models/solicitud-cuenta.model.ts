import { TipoDocumento, DatosCliente } from './cliente.model';

export interface SolicitudCuenta {
  pedidoId: string;
  tipoDocumento: TipoDocumento;
  cliente: DatosCliente | null;
  dividirPorComensal: boolean;
  incluirPropinaSugerida: boolean;
}
