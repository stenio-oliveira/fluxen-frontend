import api from '../api';
import type { SupportTicket, CreateSupportTicketDTO, UpdateSupportTicketDTO } from '../types/SupportTicket';

class SupportTicketService {
  static endpoint = 'api/suport';

  static async getTicketsByUser(): Promise<SupportTicket[]> {
    const response = await api.get(`${this.endpoint}/user`);
    return response.data;
  }

  static async createTicket(data: CreateSupportTicketDTO): Promise<SupportTicket> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateTicket(id: number, data: UpdateSupportTicketDTO): Promise<SupportTicket> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }
}

export default SupportTicketService;
