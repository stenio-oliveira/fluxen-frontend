export type SystemAnnouncementType = 'CONTINGENCY' | 'MAINTENANCE' | 'INFO' | 'CRITICAL';

export interface SystemAnnouncement {
  id: number;
  id_tenant?: number | null;
  title: string;
  description: string;
  type: SystemAnnouncementType;
  is_active: boolean;
  starts_at: string;
  ends_at?: string | null;
  created_by?: number | null;
  created_at?: string | null;
}

export interface CreateSystemAnnouncementDTO {
  title: string;
  description: string;
  type: SystemAnnouncementType;
  is_active?: boolean;
  starts_at?: string;
}

export interface UpdateSystemAnnouncementDTO {
  title?: string;
  description?: string;
  type?: SystemAnnouncementType;
  is_active?: boolean;
  starts_at?: string;
}
