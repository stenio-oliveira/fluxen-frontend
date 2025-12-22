export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  username: string;
  perfil_nome: string;
  is_gestor?: boolean; // Indica se o usuário é gestor de algum cliente
  is_responsavel?: boolean; // Indica se o usuário é responsável por algum cliente
  is_administrador?: boolean; // Indica se o usuário é administrador
}
