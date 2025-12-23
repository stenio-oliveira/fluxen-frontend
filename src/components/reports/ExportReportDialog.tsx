import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import ReportService from '../../services/reportService';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

interface ExportReportDialogProps {
  open: boolean;
  onClose: () => void;
  equipamentoId: number;
  equipamentoNome: string;
}

const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
  open,
  onClose,
  equipamentoId,
  equipamentoNome,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 dias atrás
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [format, setFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    // Validações
    if (!startDate || !endDate) {
      setError('Selecione as datas de início e fim');
      return;
    }

    if (startDate > endDate) {
      setError('Data inicial deve ser anterior à data final');
      return;
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
      setError('Intervalo máximo permitido é de 30 dias');
      return;
    }

    if (daysDiff < 0) {
      setError('Intervalo inválido');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Email inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await ReportService.requestReport(equipamentoId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
        email: email || undefined,
      });

      dispatch(
        setFeedback({
          message: response.message || 'Relatório em processamento. Você receberá por email quando estiver pronto.',
          type: 'success',
        })
      );
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao solicitar relatório. Tente novamente.';
      setError(errorMessage);
      dispatch(
        setFeedback({
          message: errorMessage,
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Exportar Relatório</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Equipamento: <strong>{equipamentoNome}</strong>
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={endDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate || undefined}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            <FormControl fullWidth required>
              <InputLabel>Formato</InputLabel>
              <Select
                value={format}
                label="Formato"
                onChange={(e) => setFormat(e.target.value as 'xlsx' | 'pdf')}
              >
                <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Email (opcional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              helperText="Se não informado, será usado o email cadastrado no seu perfil"
              placeholder={user?.email || 'seu@email.com'}
            />

            <Alert severity="info">
              O relatório será processado e enviado por email. O tempo estimado depende do
              tamanho do intervalo selecionado.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !startDate || !endDate}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processando...' : 'Solicitar Relatório'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ExportReportDialog;

