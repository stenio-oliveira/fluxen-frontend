import api from '../api';

interface LogsTableParams {
  page?: number;
  pageSize?: number;
}

class EquipamentoLogService {
  static endpoint = "api/equipamento-logs";

  static async getLogsTableData(id_equipamento: number, params?: LogsTableParams): Promise<any> {
    const response = await api.get(`${this.endpoint}/table/${id_equipamento}`, {
      params
    });
    return response.data;
  }
}

export default EquipamentoLogService;
