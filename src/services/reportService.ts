import api from '../api';

interface RequestReportDTO {
  startDate: string;
  endDate: string;
  format: 'xlsx' | 'pdf';
  email?: string;
}

interface RequestReportResponse {
  message: string;
  estimatedTime: number;
}

class ReportService {
  static endpoint = 'api/equipamentos';

  static async requestReport(
    id_equipamento: number,
    data: RequestReportDTO
  ): Promise<RequestReportResponse> {
    const response = await api.post(
      `${this.endpoint}/${id_equipamento}/reports`,
      data
    );
    return response.data;
  }
}

export default ReportService;

