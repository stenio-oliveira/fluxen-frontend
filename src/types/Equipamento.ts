import type { Cliente } from "./Cliente";

export interface Equipamento {
  id: number;
  nome: string;
  id_cliente: number;
  api_key?: string | null;
  //campos relacionados
  cliente?: Cliente;
  cliente_nome?: string;
}
