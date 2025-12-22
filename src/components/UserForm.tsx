import { Box, Stack, Typography } from '@mui/material'
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
import { useClientOptions } from '../hooks/useClientOptions';
import type { CreateUserDTO } from '../types/CreateUserDTO';
import UsuarioPerfilClienteService, { type UsuarioPerfilCliente } from '../services/usuarioPerfilClienteService';
import { IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [relacionamentos, setRelacionamentos] = React.useState<{
    id_cliente: number;
    id_perfil: number;
  }[]>([]);
  const editingUser = useSelector((state: RootState) => state.usersTable.editingUser);
  const { user } = useSelector((state: RootState) => state.user);
  const { profileOptions } = useUserProfileOptions();
  const { clientOptions } = useClientOptions();
  const isAdmin = user?.perfil_nome === 'ADM';

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

      // Validação para relacionamentos quando não for administrador
      if (formData.id_perfil !== 1 && relacionamentos.length === 0) {
        errors.relacionamentos = 'É necessário adicionar pelo menos um relacionamento com cliente';
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

        // Se for admin, atualizar relacionamentos
        if (isAdmin) {
          await UsuarioPerfilClienteService.updateRelacionamentos(
            Number(userId),
            { relacionamentos }
          );
        }

        dispatch(replaceUser(updatedUser));
        dispatch(setFeedback({ message: 'Usuário atualizado com sucesso', type: 'success' }));
      } else {
        // Para criação, prepara os dados no formato CreateUserDTO
        const createUserData: CreateUserDTO = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          username: formData.username,
          id_perfil: formData.id_perfil!,
          relacionamentos: formData.id_perfil !== 1 ? relacionamentos : [],
        };
        const newUser = await UsuarioService.createUsuario(createUserData);
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
        const userData = await UsuarioService.getUsuarioById(editingUser);
        if (userData) {
          setFormData({
            nome: userData.nome || '',
            email: userData.email || '',
            username: userData.username || '',
            senha: '', // Senha vazia para edição (não carregar por segurança)
            id_perfil: null, // Perfil não editável
          });
          setUserId(userData.id);

          // Buscar relacionamentos se for admin
          if (isAdmin) {
            try {
              const relacionamentosData = await UsuarioPerfilClienteService.getRelacionamentosByUsuario(userData.id);
              setRelacionamentos(
                relacionamentosData.map((r: UsuarioPerfilCliente) => ({
                  id_cliente: r.id_cliente,
                  id_perfil: r.id_perfil,
                }))
              );
            } catch (error) {
              console.error('Erro ao buscar relacionamentos:', error);
              setRelacionamentos([]);
            }
          }
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
      setRelacionamentos([]);
      setValidationErrors({});
    }
  }, [editingUser, dispatch, isAdmin]);

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

        {/* Seção de relacionamentos - para criação (quando não for admin) e edição (apenas para admin) */}
        {((!userId && formData.id_perfil !== 1) || (userId && isAdmin)) && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Relacionamentos com Clientes
              </Typography>
              <IconButton
                color="primary"
                onClick={() => {
                  setRelacionamentos([
                    ...relacionamentos,
                    { id_cliente: (clientOptions[0]?.id as number) || 0, id_perfil: 3 },
                  ]);
                }}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>

            {relacionamentos.map((rel, index) => {
              const clienteOption = clientOptions.find(c => c.id === rel.id_cliente);
              const perfilNome = rel.id_perfil === 2 ? 'Responsável' : rel.id_perfil === 3 ? 'Gestor' : 'Desconhecido';

              const perfilOptions = [
                { id: 2, name: 'Responsável' },
                { id: 3, name: 'Gestor' },
              ];

              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={`${clienteOption?.name || 'Cliente não encontrado'} - ${perfilNome}`}
                    color={rel.id_perfil === 3 ? 'primary' : 'secondary'}
                  />
                  <OptionsField
                    label="Cliente"
                    options={clientOptions}
                    value={rel.id_cliente}
                    onChange={(value) => {
                      const newRel = [...relacionamentos];
                      newRel[index].id_cliente = Number(value);
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Nenhum relacionamento configurado. Clique no botão + para adicionar.
              </Typography>
            )}

            {validationErrors.relacionamentos && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {validationErrors.relacionamentos}
              </Typography>
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
