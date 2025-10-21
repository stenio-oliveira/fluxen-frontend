import api from '../api';
import type { EquipmentForm } from '../components/EquipamentoForm';
import type { EquipmentFilters } from '../redux/slices/equipamentosTableSlice';
import type { Equipamento } from '../types/Equipamento';
import type { Usuario } from '../types/Usuario';

class EquipamentoService {
  static endpoint = "api/equipamentos";

  static async getEquipamentos(
    user: Usuario,
    filters: EquipmentFilters
  ): Promise<Equipamento[]> {
    console.log('EquipamentoService.getEquipamentos - user:', user);
    console.log('EquipamentoService.getEquipamentos - filters:', filters);
    console.log('EquipamentoService.getEquipamentos - endpoint:', this.endpoint);
    
    const response = await api.get(this.endpoint, { params: { 
      ...filters,
      userId: user.id
    }});
    console.log('EquipamentoService.getEquipamentos - response:', response);
    return response.data;
  }

  static async getEquipamentoById(id: number): Promise<Equipamento> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async createEquipamento(data: EquipmentForm): Promise<Equipamento> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateEquipamento(
    id: number,
    data: Partial<EquipmentForm>
  ): Promise<Equipamento> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static async deleteEquipamento(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default EquipamentoService;

