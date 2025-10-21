import api from '../api';

class EquipamentoLogService {
  static endpoint = "api/equipamento-logs";

  static async getLogsTableData(id_equipamento: number): Promise<any> {
    const response = await api.get(`${this.endpoint}/table/${id_equipamento}`);
    return response.data;
  }

  static async getEquipamentoLogs(): Promise<any[]> {
    const response = await api.get(this.endpoint);
    return response.data;
  }

  static async getEquipamentoLogById(id: number): Promise<any> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }
}

export default EquipamentoLogService;
