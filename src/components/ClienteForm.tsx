import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Input from './shared/Input';
import UsuarioService from '../services/usuarioService';
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

const ClienteForm = () => {
  const dispatch = useDispatch();
  const { creatingCliente, editingCliente } = useSelector((state: RootState) => state.clientesTable);
  const [formData, setFormData] = useState({ nome: '', email: '', username: '', senha: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("e: ", e);
    e.preventDefault();

    if(!formData.email || !formData.senha || !formData.username || !formData.nome){ 
      dispatch(setFeedback({ message: 'Preencha todos os campos', type: 'error' }));
      return;
    };
    try {
      if (creatingCliente) {
        const usuario = await UsuarioService.createClient(formData);
        if (usuario) {
          dispatch(addCliente(usuario));
          dispatch(setFeedback({ message: 'Usuário criado com sucesso', type: 'success' }));
          dispatch(setCreatingCliente(false));
        }
        return;
      }
      if (editingCliente) {
        const usuario = await UsuarioService.updateUsuario(editingCliente, formData);
        if (usuario) {
          console.log("usuario updated", usuario);
          dispatch(replaceCliente(usuario));
          dispatch(setFeedback({ message: 'Usuário atualizado com sucesso', type: 'success' }));
          dispatch(setEditingCliente(null));
        }
        return;
      }
    } catch (e) {
      dispatch(setFeedback({ message: `Erro ao salvar usuário: ${e}`, type: 'error' }));
    }
  };

  const fetchUsuario = async () => {
    if (!editingCliente) return;
    try {
      const usuario = await UsuarioService.getUsuarioById(editingCliente);
      console.log("usuario", usuario);
      setFormData({
        nome: usuario?.nome || '',
        email: usuario?.email || '',
        username: usuario?.username || '',
        senha: '', // nunca preenche senha por segurança
      });
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar usuário: ${e}`, type: 'error' }));
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, [editingCliente]);

  const fields = [
    { label: 'Nome', name: 'nome', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Usuário', name: 'username', type: 'text' },
    { label: 'Senha', name: 'senha', type: 'password' },
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
            value={formData[field.name as keyof typeof formData]}
            name={field.name}
            
            onChange={handleChange}
            label={field.label}
            id={field.name}
            required={true}
            type={field.type}
          />
        </Box>
      ))}
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