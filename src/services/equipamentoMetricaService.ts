import api from "../api";
import type { EquipamentoMetrica } from "../types/EquipamentoMetrica";

class EquipamentoMetricaService {
  static endpoint = '/equipamento-metricas';

  static getEquipamentoMetricas(): Promise<EquipamentoMetrica[]> {
    return api.get(this.endpoint);
  }

  static getEquipamentoMetricaById(id: number): Promise<EquipamentoMetrica> {
    return api.get(`${this.endpoint}/${id}`);
  }

  static createEquipamentoMetrica(data: EquipamentoMetrica): Promise<EquipamentoMetrica> {
    return api.post(this.endpoint, data);
  }

  static updateEquipamentoMetrica(id: number, data: EquipamentoMetrica): Promise<EquipamentoMetrica> {
    return api.put(`${this.endpoint}/${id}`, data);
  }

  static deleteEquipamentoMetrica(id: number): Promise<void> {
    return api.delete(`${this.endpoint}/${id}`);
  }
}

export default EquipamentoMetricaService;
