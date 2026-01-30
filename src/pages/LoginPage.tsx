import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/userSlice';
import { setFeedback } from '../redux/slices/feedBackSlice';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{ 
      const { token, user} = await AuthService.login({ email, password });
      console.log('user: ', user)
      console.log('token: ', token)
       window.localStorage.setItem("token", token);
       window.localStorage.setItem("user", JSON.stringify(user));
      dispatch(login({ user }));
      dispatch(setFeedback({ message: 'Login realizado com sucesso', type: 'success'}));
      navigate('/');
    } catch (e: any) {
      // Se for erro 401, exibir a mensagem do backend
      if (e?.response?.status === 401 && e?.response?.data?.message) {
        dispatch(setFeedback({ 
          message: e.response.data.message,
          type: 'error'
        }))
      } else {
        // Para outros erros, exibir mensagem genérica
        dispatch(setFeedback({
          message: `Erro ao fazer login: ${e?.response?.data?.message || e?.message || e}`,
          type: 'error'
        }))
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        color: 'text.primary',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0px 8px 32px rgba(0,0,0,0.1)',
          p: 3,
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <img
            src={logo}
            alt="FLUXEN Logo"
            style={{
              maxWidth: '180px',
              height: 'auto',
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Faça login para continuar
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 1.5 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: '8px',
              mb: 1.5,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Entrar
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
            <Typography
              onClick={() => navigate('/forgot-password')}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.light',
                },
                transition: 'color 0.2s ease',
              }}
            >
              Esqueci minha senha
            </Typography>

            <Typography
              onClick={() => navigate('/register')}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.light',
                },
                transition: 'color 0.2s ease',
              }}
            >
              Cadastre-se
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;