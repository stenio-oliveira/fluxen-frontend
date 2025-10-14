import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/userSlice';
import { setFeedback } from '../redux/slices/feedBackSlice';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {

  const [name, setName ] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{ 
      await AuthService.register({
        email,
        senha: password,
        nome: name,
        username: userName,
      });
      dispatch(setFeedback({ message: 'Usuário registrado com sucesso', type: 'success'}));
      navigate('/auth');
    }catch(e){ 
      dispatch(setFeedback({ 
        message: `Erro ao fazer login: ${e}`, 
        type: 'error'
      }))
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, color: "primary.main" }}>
        Faça Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "300px" }}>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="usuário"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: "8px" }}
        >
          Cadastrar
        </Button>

        <Typography
          onClick={() => navigate("/register")}
          sx={{ color: "blue", cursor: "pointer", fontSize: "small" }}
          component={"a"}
        >
          Cadastre-se
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;