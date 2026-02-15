import api from '../api';
import type { SystemAnnouncement, CreateSystemAnnouncementDTO, UpdateSystemAnnouncementDTO } from '../types/SystemAnnouncement';

class SystemAnnouncementService {
  static endpoint = 'api/system-announcements';

  static async getAnnouncements(filters?: any): Promise<SystemAnnouncement[]> {
    const response = await api.get(this.endpoint, { params: filters || {} });
    return response.data;
  }

  static async getActiveAnnouncement(): Promise<SystemAnnouncement | null> {
    try {
      const response = await api.get(`${this.endpoint}/active`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async getAnnouncementById(id: number): Promise<SystemAnnouncement> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async createAnnouncement(data: CreateSystemAnnouncementDTO): Promise<SystemAnnouncement> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateAnnouncement(id: number, data: UpdateSystemAnnouncementDTO): Promise<SystemAnnouncement> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static async deleteAnnouncement(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default SystemAnnouncementService;
