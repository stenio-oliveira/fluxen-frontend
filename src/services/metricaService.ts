import api from '../api';
import type { MetricasFilters } from '../redux/slices/metricasTableSlice';
import type { EquipamentoMetrica } from '../types/EquipamentoMetrica';
import type { Metrica } from '../types/Metrica';

class MetricaService {
  static endpoint = "api/metricas";
  static endpointEquipMetrica = "api/equipamento_metricas";

  static async getMetricas(filters?: MetricasFilters): Promise<Metrica[]> {
    const response = await api.get(this.endpoint, {
      params: filters ? filters : {},
    });
    return response.data;
  }

  static async getMetricaByEquipamentoId(
    id_equipamento: number
  ): Promise<Metrica[]> {
    const response = await api.get(
      `${this.endpoint}/equipamentos/${id_equipamento}`
    );
    return response.data;
  }

  static  updateEquipamentoMetrica = async (id: number, data: Partial<EquipamentoMetrica> ) => { 
    const response = await api.put(`${this.endpointEquipMetrica}/${id}`, data);
    return response.data
  };

  static async associateMetricToEquipamento(
    id_metrica: number,
    id_equipamento: number,
    formData: Partial<EquipamentoMetrica>
  ) {
    const response = await api.post(
      `${this.endpoint}/equipamentos/associar/${id_metrica}/${id_equipamento}`,
      formData
    );
    return response.data;
  }

  static async desassociateMetricToEquipamento(
    id_metrica: number,
    id_equipamento: number
  ): Promise<Metrica[] | null> {
    const response = await api.delete(
      `${this.endpoint}/equipamentos/desassociar/${id_metrica}/${id_equipamento}`
    );
    return response.data;
  }

  static async getMetricaById(id: number) {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async createMetrica(data: any) {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async updateMetrica(id: number, data: any) {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static deleteMetrica(id: number) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  static async getMetricasStats(): Promise<{
    totalMetricas: number;
    metricasAtivas: number;
    unidadesUnicas: number;
  }> {
    const response = await api.get(`${this.endpoint}/stats`);
    return response.data;
  }
}

export default MetricaService;
