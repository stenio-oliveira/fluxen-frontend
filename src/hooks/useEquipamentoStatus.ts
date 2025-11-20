import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EquipamentoLogService from '../services/equipamentoLogService';

interface EquipamentoStatus {
  isOnline: boolean;
  lastUpdate: Date | null;
  isRefreshing: boolean;
  currentLogCount: number;
}

export const useEquipamentoStatus = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<EquipamentoStatus>({
    isOnline: false,
    lastUpdate: null,
    isRefreshing: false,
    currentLogCount: 0
  });

  const checkStatus = useCallback(async (isAutoRefresh = false) => {
    if (!id) return;

    setStatus(prev => ({ ...prev, isRefreshing: isAutoRefresh }));

    try {
      const tableData = await EquipamentoLogService.getLogsTableData(Number(id), {
        page: 1,
        pageSize: 5
      });
      const newLogCount = tableData.pagination?.totalItems ?? tableData.rows?.length ?? 0;
      const now = new Date();

      setStatus(prev => {
        const previousLogCount = prev.currentLogCount;

        // Se não há nenhum log, o equipamento deve estar offline
        const isOnline = newLogCount === 0
          ? false
          // Se existem logs, considera online quando houver aumento de logs
          : (previousLogCount === 0 ? true : newLogCount > previousLogCount);

        return {
          isOnline,
          lastUpdate: now,
          isRefreshing: false,
          currentLogCount: newLogCount
        };
      });
    } catch (error) {
      console.error('Erro ao verificar status do equipamento:', error);
      setStatus(prev => ({ 
        ...prev, 
        isRefreshing: false,
        isOnline: false 
      }));
    }
  }, [id]);

  useEffect(() => {
    // Verificação inicial
    checkStatus();

    // Configurar verificação automática a cada 10 segundos
    const interval = setInterval(() => {
      checkStatus(true);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [checkStatus]);

  return {
    ...status,
    checkStatus
  };
};
