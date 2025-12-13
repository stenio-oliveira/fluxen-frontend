import type { Equipamento } from './Equipamento';

export interface UsuarioEquipamentoDashboard {
  id: number;
  id_usuario: number;
  id_equipamento: number;
  created_at?: string | null;
  equipamento?: Equipamento;
}


