export interface CreateUserDTO {
  nome: string;
  email: string;
  senha: string;
  username: string;
  id_perfil: number;
  relacionamentos?: {
    id_cliente: number;
    id_perfil: number; // 2 = responsável, 3 = gestor
  }[];
}

