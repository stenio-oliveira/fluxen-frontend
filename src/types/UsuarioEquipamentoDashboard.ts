import type { Equipamento } from './Equipamento';
import type { Metrica } from './Metrica';
import type { TipoGrafico } from './TipoGrafico';

export interface UsuarioEquipamentoDashboard {
  id: number;
  id_usuario: number;
  id_equipamento: number;
  id_metrica?: number | null;
  id_tipo_grafico?: number | null;
  created_at?: string | null;
  equipamento?: Equipamento;
  metrica?: Metrica;
  tipo_grafico?: TipoGrafico;
}


