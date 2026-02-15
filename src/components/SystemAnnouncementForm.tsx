import React, { useEffect, useState, useCallback } from 'react';
import { Box, Stack, TextField, FormControlLabel, Switch } from '@mui/material';
import Input from './shared/Input';
import OptionsField from './shared/OptionsField';
import SystemAnnouncementService from '../services/systemAnnouncementService';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setFeedback } from '../redux/slices/feedBackSlice';
import {
  addAnnouncement,
  replaceAnnouncement,
  setCreatingAnnouncement,
  setEditingAnnouncement,
} from '../redux/slices/systemAnnouncementsTableSlice';
import { BaseButton } from './shared/Button';
import { BaseCancelButton } from './shared/BaseCancelButton';
import type { CreateSystemAnnouncementDTO, UpdateSystemAnnouncementDTO, SystemAnnouncementType } from '../types/SystemAnnouncement';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const typeOptions = [
  { id: 'CONTINGENCY', name: 'Contingência' },
  { id: 'MAINTENANCE', name: 'Manutenção' },
  { id: 'INFO', name: 'Informação' },
  { id: 'CRITICAL', name: 'Crítico' },
];

const SystemAnnouncementForm = () => {
  const dispatch = useDispatch();
  const { creatingAnnouncement, editingAnnouncement } = useSelector((state: RootState) => state.systemAnnouncementsTable);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'INFO' as SystemAnnouncementType,
    is_active: true,
    starts_at: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeChange = (value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      type: value as SystemAnnouncementType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      dispatch(setFeedback({ message: 'Título é obrigatório', type: 'error' }));
      return;
    }

    if (!formData.description.trim()) {
      dispatch(setFeedback({ message: 'Descrição é obrigatória', type: 'error' }));
      return;
    }

    try {
      if (creatingAnnouncement) {
        const createData: CreateSystemAnnouncementDTO = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          is_active: formData.is_active,
          starts_at: formData.starts_at.toISOString(),
        };
        const announcement = await SystemAnnouncementService.createAnnouncement(createData);
        if (announcement) {
          dispatch(addAnnouncement(announcement));
          dispatch(setFeedback({ message: 'Anúncio criado com sucesso', type: 'success' }));
          dispatch(setCreatingAnnouncement(false));
        }
        return;
      }
      if (editingAnnouncement) {
        const updateData: UpdateSystemAnnouncementDTO = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          is_active: formData.is_active,
          starts_at: formData.starts_at.toISOString(),
        };
        const announcement = await SystemAnnouncementService.updateAnnouncement(editingAnnouncement, updateData);
        if (announcement) {
          dispatch(replaceAnnouncement(announcement));
          dispatch(setFeedback({ message: 'Anúncio atualizado com sucesso', type: 'success' }));
          dispatch(setEditingAnnouncement(null));
        }
        return;
      }
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao salvar anúncio: ${e?.response?.data?.message || e?.message || e}`, type: 'error' }));
    }
  };

  const fetchAnnouncement = useCallback(async () => {
    if (!editingAnnouncement) {
      setFormData({
        title: '',
        description: '',
        type: 'INFO',
        is_active: true,
        starts_at: new Date(),
      });
      return;
    }
    try {
      const announcement = await SystemAnnouncementService.getAnnouncementById(editingAnnouncement);
      setFormData({
        title: announcement?.title || '',
        description: announcement?.description || '',
        type: announcement?.type || 'INFO',
        is_active: announcement?.is_active ?? true,
        starts_at: announcement?.starts_at ? new Date(announcement.starts_at) : new Date(),
      });
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar anúncio: ${e}`, type: 'error' }));
    }
  }, [editingAnnouncement, dispatch]);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box
        component="form"
        onSubmit={(e: React.FormEvent) => handleSubmit(e)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
      >
        <Input
          value={formData.title}
          name="title"
          onChange={handleChange}
          label="Título"
          id="title"
          required
          type="text"
        />

        <TextField
          value={formData.description}
          name="description"
          onChange={handleChange}
          label="Descrição"
          id="description"
          required
          multiline
          rows={4}
          fullWidth
          variant="outlined"
        />

        <OptionsField
          label="Tipo"
          options={typeOptions}
          value={formData.type}
          onChange={handleTypeChange}
          required
        />

        <DateTimePicker
          label="Data de Início"
          value={formData.starts_at}
          onChange={(newValue) => {
            if (newValue) {
              setFormData((prev) => ({ ...prev, starts_at: newValue }));
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
            },
          }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
              }}
            />
          }
          label="Anúncio Ativo"
        />

        <Stack direction="row" spacing={2}>
          <BaseButton type="submit">
            {creatingAnnouncement ? 'Criar' : 'Salvar'}
          </BaseButton>
          <BaseCancelButton
            onClick={() => {
              if (creatingAnnouncement) {
                dispatch(setCreatingAnnouncement(false));
                return;
              }
              if (editingAnnouncement) {
                dispatch(setEditingAnnouncement(null));
                return;
              }
            }}
          >
            Cancelar
          </BaseCancelButton>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default SystemAnnouncementForm;
