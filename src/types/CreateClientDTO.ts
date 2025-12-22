export interface CreateClientDTO {
  nome: string;
  cnpj: string;
  relacionamentos?: {
    id_usuario: number;
    id_perfil: number; // 2 = responsável, 3 = gestor
  }[];
}

