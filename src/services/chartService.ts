import api from '../api';
import type { ChartData, TimeRange } from '../types/Chart';

class ChartService {
  static endpoint = '/api/charts';

  /**
   * Busca dados para gráfico de linha
   */
  static async getLineChartData(
    id_equipamento: number,
    id_metrica: number,
    timeRange: TimeRange = '5min'
  ): Promise<ChartData> {
    const response = await api.get(
      `${this.endpoint}/line/${id_equipamento}/${id_metrica}`,
      { params: { timeRange } }
    );
    return response.data;
  }

  /**
   * Busca dados para gráfico de rosca (doughnut)
   */
  static async getDoughnutChartData(
    id_equipamento: number,
    id_metrica: number
  ): Promise<ChartData> {
    const response = await api.get(
      `${this.endpoint}/doughnut/${id_equipamento}/${id_metrica}`
    );
    return response.data;
  }

  /**
   * Busca dados para gráfico de barras
   */
  static async getBarChartData(
    id_equipamento: number,
    id_metrica: number,
    timeRange: TimeRange = '1h'
  ): Promise<ChartData> {
    const response = await api.get(
      `${this.endpoint}/bar/${id_equipamento}/${id_metrica}`,
      { params: { timeRange } }
    );
    return response.data;
  }
}

export default ChartService;

