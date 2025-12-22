import type { Equipamento } from './Equipamento';
import type { Metrica } from './Metrica';

export interface UsuarioEquipamentoDashboard {
  id: number;
  id_usuario: number;
  id_equipamento: number;
  id_metrica?: number | null;
  created_at?: string | null;
  equipamento?: Equipamento;
  metrica?: Metrica;
}


