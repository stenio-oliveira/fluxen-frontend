import type { Usuario } from "./Usuario";

export interface Equipamento {
  id: number;
  nome: string;
  id_usuario: number;
  //campos relacionados
  cliente?: Usuario;
  cliente_nome?: string;
}
