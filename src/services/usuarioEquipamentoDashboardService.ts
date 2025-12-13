import api from '../api';
import type { UsuarioEquipamentoDashboard } from '../types/UsuarioEquipamentoDashboard';
import type { Equipamento } from '../types/Equipamento';

class UsuarioEquipamentoDashboardService {
  static endpoint = 'api/usuario-equipamento-dashboard';

  /**
   * Busca todos os equipamentos do dashboard do usuário
   */
  static async getEquipamentosDashboard(userId: number): Promise<UsuarioEquipamentoDashboard[]> {
    const response = await api.get(`${this.endpoint}/${userId}`);
    return response.data;
  }

  /**
   * Adiciona um equipamento ao dashboard do usuário
   */
  static async addEquipamentoToDashboard(
    userId: number,
    equipamentoId: number
  ): Promise<UsuarioEquipamentoDashboard> {
    const response = await api.post(this.endpoint, {
      userId,
      equipamentoId
    });
    return response.data;
  }

  /**
   * Remove um equipamento do dashboard do usuário
   */
  static async removeEquipamentoFromDashboard(
    userId: number,
    equipamentoId: number
  ): Promise<void> {
    await api.delete(`${this.endpoint}/${userId}/${equipamentoId}`);
  }

  /**
   * Verifica se um equipamento está no dashboard do usuário
   */
  static async checkEquipamentoInDashboard(
    userId: number,
    equipamentoId: number
  ): Promise<boolean> {
    const response = await api.get(`${this.endpoint}/${userId}/${equipamentoId}/check`);
    return response.data.exists;
  }

  /**
   * Busca apenas os equipamentos (sem a estrutura de associação)
   */
  static async getEquipamentos(userId: number): Promise<Equipamento[]> {
    const dashboardItems = await this.getEquipamentosDashboard(userId);
    return dashboardItems
      .map(item => item.equipamento)
      .filter((equipamento): equipamento is Equipamento => equipamento !== undefined);
  }
}

export default UsuarioEquipamentoDashboardService;


