import api from '../api';

export interface UsuarioPerfilCliente {
  id: number;
  id_usuario: number;
  id_cliente: number;
  id_perfil: number;
  cliente?: {
    id: number;
    nome: string;
  };
  perfil?: {
    id: number;
    nome: string;
  };
}

export interface UpdateRelacionamentosDTO {
  relacionamentos: {
    id_cliente: number;
    id_perfil: number; // 2 = responsável, 3 = gestor
  }[];
}

export interface UpdateClienteRelacionamentosDTO {
  relacionamentos: {
    id_usuario: number;
    id_perfil: number; // 2 = responsável, 3 = gestor
  }[];
}

class UsuarioPerfilClienteService {
  static endpoint = 'api/usuarios';

  static async getRelacionamentosByUsuario(
    id_usuario: number
  ): Promise<UsuarioPerfilCliente[]> {
    const response = await api.get(
      `${this.endpoint}/${id_usuario}/relacionamentos`
    );
    return response.data;
  }

  static async updateRelacionamentos(
    id_usuario: number,
    data: UpdateRelacionamentosDTO
  ): Promise<UsuarioPerfilCliente[]> {
    const response = await api.put(
      `${this.endpoint}/${id_usuario}/relacionamentos`,
      data
    );
    return response.data;
  }

  static async getRelacionamentosByCliente(
    id_cliente: number
  ): Promise<UsuarioPerfilCliente[]> {
    const response = await api.get(
      `api/clientes/${id_cliente}/relacionamentos`
    );
    return response.data;
  }

  static async updateRelacionamentosByCliente(
    id_cliente: number,
    data: UpdateClienteRelacionamentosDTO
  ): Promise<UsuarioPerfilCliente[]> {
    const response = await api.put(
      `api/clientes/${id_cliente}/relacionamentos`,
      data
    );
    return response.data;
  }
}

export default UsuarioPerfilClienteService;

