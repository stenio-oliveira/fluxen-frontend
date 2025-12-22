import React, { useEffect, useState, useCallback } from 'react';
import { Box, Stack, Typography, IconButton, Chip } from '@mui/material';
import Input from './shared/Input';
import OptionsField from './shared/OptionsField';
import ClienteService from '../services/clienteService';
import UsuarioPerfilClienteService from '../services/usuarioPerfilClienteService';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setFeedback } from '../redux/slices/feedBackSlice';
import {
  addCliente,
  replaceCliente,
  setCreatingCliente,
  setEditingCliente,
} from '../redux/slices/clientesTableSlice';
import { BaseButton } from './shared/Button';
import { BaseCancelButton } from './shared/BaseCancelButton';
import { useUserOptions } from '../hooks/useUserOptions';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CreateClientDTO } from '../types/CreateClientDTO';
import type { UsuarioPerfilCliente } from '../services/usuarioPerfilClienteService';

const ClienteForm = () => {
  const dispatch = useDispatch();
  const { creatingCliente, editingCliente } = useSelector((state: RootState) => state.clientesTable);
  const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({ nome: '', cnpj: '' });
  const [relacionamentos, setRelacionamentos] = useState<{
    id_usuario: number;
    id_perfil: number;
  }[]>([]);
  const { userOptions } = useUserOptions();
  const isAdmin = user?.perfil_nome === 'ADM';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome) {
      dispatch(setFeedback({ message: 'Preencha todos os campos obrigatórios', type: 'error' }));
      return;
    }

    try {
      if (creatingCliente) {
        const createClientData: CreateClientDTO = {
          nome: formData.nome,
          cnpj: formData.cnpj || '',
          relacionamentos: relacionamentos.length > 0 ? relacionamentos : [],
        };
        const cliente = await ClienteService.createCliente(createClientData);
        if (cliente) {
          dispatch(addCliente(cliente));
          dispatch(setFeedback({ message: 'Cliente criado com sucesso', type: 'success' }));
          dispatch(setCreatingCliente(false));
        }
        return;
      }
      if (editingCliente) {
        const cliente = await ClienteService.updateCliente(editingCliente, formData);
        if (cliente) {
          // Se for admin, atualizar relacionamentos
          if (isAdmin) {
            await UsuarioPerfilClienteService.updateRelacionamentosByCliente(
              editingCliente,
              { relacionamentos }
            );
          }
          dispatch(replaceCliente(cliente));
          dispatch(setFeedback({ message: 'Cliente atualizado com sucesso', type: 'success' }));
          dispatch(setEditingCliente(null));
        }
        return;
      }
    } catch (e) {
      dispatch(setFeedback({ message: `Erro ao salvar cliente: ${e}`, type: 'error' }));
    }
  };

  const fetchCliente = useCallback(async () => {
    if (!editingCliente) {
      setFormData({ nome: '', cnpj: '' });
      setRelacionamentos([]);
      return;
    }
    try {
      const cliente = await ClienteService.getClienteById(editingCliente);
      setFormData({
        nome: cliente?.nome || '',
        cnpj: cliente?.cnpj || '',
      });

      // Buscar relacionamentos se for admin
      if (isAdmin && cliente?.id) {
        try {
          const relacionamentosData = await UsuarioPerfilClienteService.getRelacionamentosByCliente(cliente.id);
          setRelacionamentos(
            relacionamentosData.map((r: UsuarioPerfilCliente) => ({
              id_usuario: r.id_usuario,
              id_perfil: r.id_perfil,
            }))
          );
        } catch (error) {
          console.error('Erro ao buscar relacionamentos:', error);
          setRelacionamentos([]);
        }
      }
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar cliente: ${e}`, type: 'error' }));
    }
  }, [editingCliente, isAdmin, dispatch]);

  useEffect(() => {
    fetchCliente();
  }, [fetchCliente]);

  const fields = [
    { label: 'Nome', name: 'nome', type: 'text' },
    { label: 'CNPJ', name: 'cnpj', type: 'text' },
  ];

  return (
    <Box
      component={"form"}
      onSubmit={(e: React.FormEvent) => handleSubmit(e)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {fields.map((field) => (
        <Box key={field.name}>
          <Input
            value={formData[field.name as keyof typeof formData] || ''}
            name={field.name}
            onChange={handleChange}
            label={field.label}
            id={field.name}
            required={field.name === 'nome'}
            type={field.type}
          />
        </Box>
      ))}

      {/* Seção de relacionamentos - sempre visível para criação e edição (apenas para admin) */}
      {(creatingCliente || (editingCliente && isAdmin)) && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Relacionamentos com Usuários
            </Typography>
            <IconButton
              color="primary"
              onClick={() => {
                setRelacionamentos([
                  ...relacionamentos,
                  { id_usuario: (userOptions[0]?.id as number) || 0, id_perfil: 2 },
                ]);
              }}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {relacionamentos.map((rel, index) => {
            const usuarioOption = userOptions.find(u => u.id === rel.id_usuario);
            const perfilNome = rel.id_perfil === 2 ? 'Responsável' : rel.id_perfil === 3 ? 'Gestor' : 'Desconhecido';

            const perfilOptions = [
              { id: 2, name: 'Responsável' },
              { id: 3, name: 'Gestor' },
            ];

            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={`${usuarioOption?.name || 'Usuário não encontrado'} - ${perfilNome}`}
                  color={rel.id_perfil === 3 ? 'primary' : 'secondary'}
                />
                <OptionsField
                  label="Usuário"
                  options={userOptions}
                  value={rel.id_usuario}
                  onChange={(value) => {
                    const newRel = [...relacionamentos];
                    newRel[index].id_usuario = Number(value);
                    setRelacionamentos(newRel);
                  }}
                />
                <OptionsField
                  label="Perfil"
                  options={perfilOptions}
                  value={rel.id_perfil}
                  onChange={(value) => {
                    const newRel = [...relacionamentos];
                    newRel[index].id_perfil = Number(value);
                    setRelacionamentos(newRel);
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    setRelacionamentos(relacionamentos.filter((_, i) => i !== index));
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}

          {relacionamentos.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Nenhum relacionamento adicionado. O cliente será cadastrado sem relacionamentos.
            </Typography>
          )}
        </Box>
      )}
      <Stack direction="row" spacing={2}>
        {creatingCliente ? (
          <BaseButton
            type="submit"
            // onClick={(e: React.FormEvent) => handleSubmit(e)}
          >
            Criar
          </BaseButton>
        ) : (
          <BaseButton
            type="submit"
            onClick={(e: React.FormEvent) => handleSubmit(e)}
          >
            Salvar
          </BaseButton>
        )}
        <BaseCancelButton
          onClick={() => {
            if (creatingCliente) {
              dispatch(setCreatingCliente(false));
              return;
            }
            if (editingCliente) {
              dispatch(setEditingCliente(null));
              return;
            }
          }}
        >
          Cancelar
        </BaseCancelButton>
      </Stack>
    </Box>
  );
};

export default ClienteForm;