import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PasswordResetService from '../services/passwordResetService';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../redux/slices/feedBackSlice';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await PasswordResetService.requestPasswordReset({ email });
      setSuccess(true);
      dispatch(
        setFeedback({
          message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
          type: 'success',
        })
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao processar solicitação';
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
        Esqueci minha senha
      </Typography>

      {success ? (
        <Box sx={{ width: '400px', textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
          </Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/auth')}
            sx={{ mt: 2 }}
          >
            Voltar para login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '400px' }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Digite seu email e enviaremos um link para redefinir sua senha.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Enviando...' : 'Enviar link de redefinição'}
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
      )}
    </Box>
  );
};

export default ForgotPasswordPage;

