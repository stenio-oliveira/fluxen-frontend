import api from '../api';
import type { Notificacao } from '../types/Notificacao';

class NotificacaoService {
  static endpoint = 'api/notificacoes';

  static async getNotifications(viewed?: boolean): Promise<Notificacao[]> {
    const params = viewed !== undefined ? { viewed: viewed.toString() } : {};
    const response = await api.get(this.endpoint, { params });
    return response.data;
  }

  static async getUnreadCount(): Promise<number> {
    const response = await api.get(`${this.endpoint}/count`);
    return response.data.count;
  }

  static async markAsRead(id: number): Promise<Notificacao> {
    const response = await api.put(`${this.endpoint}/${id}/visualizar`);
    return response.data;
  }

  static async markAllAsRead(): Promise<{ count: number; message: string }> {
    const response = await api.put(`${this.endpoint}/visualizar-todas`);
    return response.data;
  }
}

export default NotificacaoService;


