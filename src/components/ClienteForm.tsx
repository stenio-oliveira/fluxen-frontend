import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Input from './shared/Input';
import OptionsField from './shared/OptionsField';
import ClienteService from '../services/clienteService';
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

const ClienteForm = () => {
  const dispatch = useDispatch();
  const { creatingCliente, editingCliente } = useSelector((state: RootState) => state.clientesTable);
  const [formData, setFormData] = useState({ nome: '', cnpj: '', id_responsavel: null as number | null });
  const { userOptions } = useUserOptions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'id_responsavel' ? (value ? Number(value) : null) : value
    }));
  };

  const handleResponsavelChange = (value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      id_responsavel: value ? Number(value) : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome) {
      dispatch(setFeedback({ message: 'Preencha todos os campos obrigatórios', type: 'error' }));
      return;
    };
    try {
      if (creatingCliente) {
        const cliente = await ClienteService.createCliente(formData);
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

  const fetchCliente = async () => {
    if (!editingCliente) return;
    try {
      const cliente = await ClienteService.getClienteById(editingCliente);
      console.log("cliente", cliente);
      setFormData({
        nome: cliente?.nome || '',
        cnpj: cliente?.cnpj || '',
        id_responsavel: cliente?.id_responsavel || null,
      });
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar cliente: ${e}`, type: 'error' }));
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [editingCliente]);

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

      <Box>
        <OptionsField
          label="Usuário Responsável"
          options={userOptions}
          value={formData.id_responsavel || ''}
          onChange={handleResponsavelChange}
        />
      </Box>
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