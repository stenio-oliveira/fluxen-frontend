import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordResetService from '../services/passwordResetService';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../redux/slices/feedBackSlice';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidating(false);
        return;
      }

      try {
        const isValid = await PasswordResetService.validateToken(token);
        setTokenValid(isValid);
        if (!isValid) {
          setError('Token inválido ou expirado');
        }
      } catch (err) {
        setTokenValid(false);
        setError('Erro ao validar token');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!token) {
      setError('Token não encontrado');
      return;
    }

    setLoading(true);

    try {
      await PasswordResetService.resetPassword({
        token,
        newPassword,
      });
      setSuccess(true);
      dispatch(
        setFeedback({
          message: 'Senha redefinida com sucesso!',
          type: 'success',
        })
      );
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao redefinir senha';
      setError(errorMessage);
      dispatch(
        setFeedback({
          message: `Erro: ${errorMessage}`,
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
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
        }}
      >
        <Typography variant="h6">Validando token...</Typography>
      </Box>
    );
  }

  if (!tokenValid) {
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
        }}
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: '400px' }}>
          {error || 'Token inválido ou expirado'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/auth')}>
          Voltar para login
        </Button>
      </Box>
    );
  }

  if (success) {
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
        }}
      >
        <Alert severity="success" sx={{ mb: 2, maxWidth: '400px' }}>
          Senha redefinida com sucesso! Redirecionando para o login...
        </Alert>
      </Box>
    );
  }

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
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
        Redefinir senha
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '400px' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Nova senha"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
          helperText="Mínimo de 6 caracteres"
        />

        <TextField
          label="Confirmar nova senha"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mb: 2, borderRadius: '8px' }}
        >
          {loading ? 'Redefinindo...' : 'Redefinir senha'}
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={() => navigate('/auth')}
          sx={{ mt: 1 }}
        >
          Voltar para login
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;

