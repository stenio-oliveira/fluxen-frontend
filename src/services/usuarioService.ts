import api from '../api';
import type { ClientesFilters } from '../redux/slices/clientesTableSlice';
import type { Usuario } from '../types/Usuario';

class UsuarioService {
  static endpoint = "api/usuarios";

  static async getUsuarios(): Promise<Usuario[]> {
    const response = await api.get(this.endpoint);
    return response.data;
  }

  static async getUsuarioById(id: number): Promise<Usuario> {
    const response =  await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async getClientUsers(filters?: ClientesFilters): Promise<Usuario[]> {
    const response = await api.get(`${this.endpoint}/perfil/clientes`, { params: filters ? filters : {} });
    return response.data;
  }

  static async getClienteByEquipamentoId(id: number): Promise<Usuario> {
    const response = await api.get(`${this.endpoint}/equipamentos/${id}`);
    return response.data;
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

