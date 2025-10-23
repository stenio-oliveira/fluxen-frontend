import { Box, Stack } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import Input from './shared/Input'
import OptionsField from './shared/OptionsField'
import { useDispatch, useSelector } from 'react-redux';
import UsuarioService from '../services/usuarioService';
import { setFeedback } from '../redux/slices/feedBackSlice';
import { BaseButton } from './shared/Button';
import type { RootState } from '../redux/store';
import { addUser, replaceUser, setCreatingUser, setEditingUser } from '../redux/slices/usersTableSlice';
import { BaseCancelButton } from './shared/BaseCancelButton';
import { useUserProfileOptions } from '../hooks/useUserProfileOptions';

export interface UserForm {
  nome: string;
  email: string;
  username: string;
  senha: string;
  id_perfil: number | null;
}

const UserForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState<UserForm>({
    nome: '',
    email: '',
    username: '',
    senha: '',
    id_perfil: null,
  });
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [userId, setUserId] = React.useState<number | null>(null);
  const editingUser = useSelector((state: RootState) => state.usersTable.editingUser);
  const { profileOptions } = useUserProfileOptions();

  const fields = [
    {label: 'Nome', name: 'nome'},
    {label: 'Email', name: 'email'},
    {label: 'Usuário', name: 'username'},
  ];

  // Campo senha apenas para criação
  const passwordField = {label: 'Senha', name: 'senha', type: 'password'};

  const resetFormData = ( ) => { 
      fetchDataCallback();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    // Limpar erro de validação quando o usuário começar a digitar
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProfileChange = (value: string | number) => {
    setFormData({ ...formData, id_perfil: value ? Number(value) : null });
    
    // Limpar erro de validação do perfil
    if (validationErrors.id_perfil) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.id_perfil;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validar campos obrigatórios
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email é obrigatório';
    } else {
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Email deve ter um formato válido';
      }
    }
    
    if (!formData.username || formData.username.trim() === '') {
      errors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      errors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    // Validações específicas para criação
    if (!userId) {
      if (!formData.senha || formData.senha.trim() === '') {
        errors.senha = 'Senha é obrigatória';
      } else if (formData.senha.length < 6) {
        errors.senha = 'Senha deve ter pelo menos 6 caracteres';
      }
      
      if (!formData.id_perfil) {
        errors.id_perfil = 'Perfil é obrigatório';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      dispatch(
        setFeedback({
          message: "Por favor, corrija os erros no formulário",
          type: "error",
        })
      );
      return;
    }
    
    try {
      if (userId) {
        // Para edição, remove a senha e id_perfil dos dados enviados
        const { senha, id_perfil, ...updateData } = formData;
        const updatedUser = await UsuarioService.updateUsuario(
          Number(userId),
          updateData
        );
        dispatch(replaceUser(updatedUser));
        dispatch(setFeedback({ message: 'Usuário atualizado com sucesso', type: 'success' }));
      } else {
        // Para criação, inclui a senha e perfil
        const newUser = await UsuarioService.createUsuario(formData);
        dispatch(addUser(newUser));
        dispatch(setFeedback({ message: 'Usuário criado com sucesso', type: 'success' }));
      }
      dispatch(setCreatingUser(false));
      dispatch(setEditingUser(null));
      resetFormData();
    } catch (error: any) {
      dispatch(setFeedback({ message: `Erro ao salvar usuário: ${error}`, type: 'error' }));
    }
  };

  const fetchDataCallback = useCallback(async () => {
    if (editingUser) {
      try {
        const user = await UsuarioService.getUsuarioById(editingUser);
        if (user) {
          setFormData({
            nome: user.nome || '',
            email: user.email || '',
            username: user.username || '',
            senha: '', // Senha vazia para edição (não carregar por segurança)
            id_perfil: null, // Perfil não editável
          });
          setUserId(user.id);
        }
      } catch (error: any) {
        dispatch(setFeedback({ message: `Erro ao carregar usuário: ${error}`, type: 'error' }));
      }
    } else {
      setFormData({
        nome: '',
        email: '',
        username: '',
        senha: '',
        id_perfil: null,
      });
      setUserId(null);
      setValidationErrors({});
    }
  }, [editingUser, dispatch]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const handleCancel = () => {
    dispatch(setCreatingUser(false));
    dispatch(setEditingUser(null));
    setValidationErrors({});
    resetFormData();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        {fields.map((field) => (
          <Box key={field.name}>
            <Input
              label={field.label}
              name={field.name}
              type="text"
              value={formData[field.name as keyof UserForm] || ''}
              onChange={handleChange}
              required
            />
            {validationErrors[field.name] && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors[field.name]}
              </span>
            )}
          </Box>
        ))}
        
        {/* Campo senha apenas para criação */}
        {!userId && (
          <Box>
            <Input
              key={passwordField.name}
              label={passwordField.label}
              name={passwordField.name}
              type="password"
              value={formData[passwordField.name as keyof UserForm] || ''}
              onChange={handleChange}
              required
            />
            {validationErrors[passwordField.name] && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors[passwordField.name]}
              </span>
            )}
          </Box>
        )}

        {/* Campo perfil apenas para criação */}
        {!userId && (
          <Box>
            <OptionsField
              label="Perfil"
              options={profileOptions}
              value={formData.id_perfil || ''}
              onChange={handleProfileChange}
              required
            />
            {validationErrors.id_perfil && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors.id_perfil}
              </span>
            )}
          </Box>
        )}
        
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <BaseCancelButton onClick={handleCancel} >
            Cancelar
          </BaseCancelButton>
          <BaseButton type="submit">
            {userId ? 'Atualizar' : 'Criar'}
          </BaseButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserForm;
