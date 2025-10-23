import api from '../api';
import type { UserFilters } from '../redux/slices/usersTableSlice';
import type { Usuario } from '../types/Usuario';

class UsuarioService {
  static endpoint = "api/usuarios";

  static async getUsuarios(user: Usuario, filters: UserFilters): Promise<Usuario[]> {
    const response = await api.get(this.endpoint, { 
      params: { 
        ...filters,
        userId: user.id 
      } 
    });
    return response.data;
  }

  static async getUsuarioById(id: number): Promise<Usuario> {
    const response =  await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async getClienteByEquipamentoId(id: number): Promise<Usuario | null> {
    try {
      const response = await api.get(`${this.endpoint}/equipamentos/${id}`);
      return response.data;
    } catch (error: any) {
      // Se retornar 404 ou erro, significa que não há cliente associado
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static async deleteUsuario(id: number): Promise<void> {
    const response = await api.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async createClient(data: Partial<Usuario>): Promise<Usuario> {
    const response = await api.post(`${this.endpoint}/cliente`, data);
    return response.data;
  }
}

export default UsuarioService;

