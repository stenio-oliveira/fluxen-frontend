import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CloudUpload, Send } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import SupportTicketService from '../services/supportTicketService';
import FirebaseService from '../services/firebaseService';
import { setFeedback } from '../redux/slices/feedBackSlice';

const SupportPage: React.FC = () => {
  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    descricao: '',
    email: user?.email || '',
    numero_telefone: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar se é uma imagem
      if (!file.type.startsWith('image/')) {
        dispatch(setFeedback({ message: 'Por favor, selecione apenas arquivos de imagem', type: 'error' }));
        return;
      }
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatch(setFeedback({ message: 'A imagem deve ter no máximo 5MB', type: 'error' }));
        return;
      }
      setSelectedFile(file);
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descricao.trim()) {
      dispatch(setFeedback({ message: 'Por favor, descreva o problema, dúvida ou erro', type: 'error' }));
      return;
    }

    if (!formData.email.trim()) {
      dispatch(setFeedback({ message: 'Por favor, informe seu email', type: 'error' }));
      return;
    }

    setIsSubmitting(true);

    try {
      let anexoUrl: string | undefined = undefined;

      // Upload da imagem se houver
      if (selectedFile) {
        const timestamp = Date.now();
        const filename = `support_${timestamp}_${selectedFile.name}`;
        anexoUrl = await FirebaseService.upload(selectedFile, filename);
      }

      // Criar ticket de suporte
      await SupportTicketService.createTicket({
        descricao: formData.descricao,
        email: formData.email,
        numero_telefone: formData.numero_telefone || undefined,
        anexo: anexoUrl,
      });

      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true);
      
      // Limpar formulário
      setFormData({
        descricao: '',
        email: user?.email || '',
        numero_telefone: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);

      dispatch(setFeedback({ message: 'Ticket de suporte enviado com sucesso!', type: 'success' }));
    } catch (error: any) {
      console.error('Erro ao enviar ticket:', error);
      dispatch(setFeedback({
        message: `Erro ao enviar ticket: ${error?.response?.data?.message || error?.message || 'Erro desconhecido'}`,
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'grey.50',
        p: isMobile ? 2 : 3,
        pt: isMobile ? 6 : 3,
        marginLeft: sideMenuWidth,
        width: `calc(100vw - ${sideMenuWidth})`,
        maxWidth: '100%',
        boxSizing: 'border-box',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{
          mb: isMobile ? 2 : 3,
          mt: isMobile ? 2 : 0,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Suporte
      </Typography>

      {showSuccessMessage ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'white',
              maxWidth: 600,
              width: '100%',
            }}
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ticket enviado com sucesso!
              </Typography>
              <Typography variant="body1">
                Em breve nossa equipe entrará em contato através do email e/ou número informado.
              </Typography>
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSuccessMessage(false)}
            >
              Enviar outro ticket
            </Button>
          </Paper>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 2 : 4,
            maxWidth: 800,
            mx: 'auto',
            width: '100%',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />

              <TextField
                label="Número de Telefone"
                name="numero_telefone"
                type="tel"
                value={formData.numero_telefone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="(00) 00000-0000"
              />

              <TextField
                label="Descrição do Problema, Dúvida ou Erro"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Descreva detalhadamente o problema, dúvida ou erro que está enfrentando..."
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Anexo (Imagem)
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {selectedFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                  </Button>
                </label>

                {previewUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 300,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={handleRemoveFile}
                      sx={{ mt: 1 }}
                    >
                      Remover Imagem
                    </Button>
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default SupportPage;
