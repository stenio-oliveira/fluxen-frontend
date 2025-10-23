import api from '../api';
import type { Perfil } from '../types/Perfil';
import type { UsuarioPerfil } from '../types/UsuarioPerfil';

class UsuarioPerfilService {
  static endpoint = '/api/usuario-perfis';

  static async getUsuarioPerfis(): Promise<Perfil[]> {
    const response = await api.get(this.endpoint);
    return response.data;
  }

  static async getUsuarioPerfilById(id: number): Promise<Perfil> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async createUsuarioPerfil(data: Partial<UsuarioPerfil>): Promise<Perfil> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateUsuarioPerfil(id: number, data: Partial<Perfil>): Promise<Perfil> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static async deleteUsuarioPerfil(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default UsuarioPerfilService;