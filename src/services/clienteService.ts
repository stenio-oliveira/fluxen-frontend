import api from '../api';
import type { Cliente } from '../types/Cliente';
import type { Usuario } from '../types/Usuario';
import type { ClienteFilters } from '../redux/slices/clientesTableSlice';

class ClienteService {
  static endpoint = "api/clientes";

  static async getClientes(user: Usuario, filters: ClienteFilters): Promise<Cliente[]> {
    console.log('ClienteService.getClientes - user:', user);
    console.log('ClienteService.getClientes - filters:', filters);
    console.log('ClienteService.getClientes - endpoint:', this.endpoint);
    
    const response = await api.get(this.endpoint, { 
      params: { 
        ...filters,
        userId: user.id 
      } 
    });
    console.log('ClienteService.getClientes - response:', response);
    return response.data;
  }

  static async getClienteById(id: number): Promise<Cliente> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async createCliente(data: Partial<Cliente>): Promise<Cliente> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateCliente(id: number, data: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static async deleteCliente(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default ClienteService;
