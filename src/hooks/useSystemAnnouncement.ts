import { useState, useEffect, useCallback } from 'react';
import SystemAnnouncementService from '../services/systemAnnouncementService';
import type { SystemAnnouncement } from '../types/SystemAnnouncement';

export const useSystemAnnouncement = () => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<SystemAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveAnnouncement = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const announcement = await SystemAnnouncementService.getActiveAnnouncement();
      setActiveAnnouncement(announcement);
    } catch (err: any) {
      setError(err?.message || 'Erro ao buscar anúncio ativo');
      setActiveAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveAnnouncement();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchActiveAnnouncement, 30000);
    
    return () => clearInterval(interval);
  }, [fetchActiveAnnouncement]);

  const isContingency = activeAnnouncement?.type === 'CONTINGENCY';
  const hasActiveAnnouncement = activeAnnouncement !== null;

  return {
    activeAnnouncement,
    loading,
    error,
    isContingency,
    hasActiveAnnouncement,
    refetch: fetchActiveAnnouncement,
  };
};
