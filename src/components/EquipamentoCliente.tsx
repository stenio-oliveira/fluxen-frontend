import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useParams } from "react-router-dom";
import EquipamentoService from "../services/equipamentoService";
import UsuarioService from "../services/usuarioService";
import type { Usuario } from "../types/Usuario";
import EditIcon from '@mui/icons-material/Edit';
import { BaseIconButton } from "./shared/BaseIconButton";
import { useClientOptions } from "../hooks/useClientOptions";
import OptionsField from "./shared/OptionsField";
import type { Equipamento } from "../types/Equipamento";
import { BaseButton } from "./shared/Button";
import { BaseCancelButton } from "./shared/BaseCancelButton";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";


const EquipamentoCliente = () => {
  const dispatch = useDispatch();
  const { id }  = useParams();
  const [editingClient, setEditingClient] = useState(false);
  const [clienteInfo, setClientInfo] = useState<Partial<Usuario>>({});
  const {clientOptions} = useClientOptions();
  const [formData, setFormData] = useState<Partial<Equipamento>>({
    id : Number(id),
    id_usuario: Number(clienteInfo.id),
  });

  const fields = [
    { label: "Nome", value: clienteInfo.nome },
    { label: "Email", value: clienteInfo.email },
    { label: "Username", value: clienteInfo.username },
    { label: "ID", value: clienteInfo.id },
  ];

  const handleChangeAssociatedClient = async () => {
    try {
      const updatedEquip = await EquipamentoService.updateEquipamento(
        Number(id),
        {
          id_usuario: Number(formData.id_usuario),
        }
      );
      setClientInfo(updatedEquip.cliente ? updatedEquip.cliente : {});
      setEditingClient(false);
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: `Erro ao atualizar equipamento: ${e}`,
          type: "error",
        })
      );
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const client = await UsuarioService.getClienteByEquipamentoId(Number(id));
      setClientInfo(client || {});
      console.log(client);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      // Se não houver cliente associado, define como objeto vazio
      setClientInfo({});
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 400,
        boxShadow: "none",
        position: "relative",
        borderRadius: 2,
        border: "1px solid #e0e0e0"
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Verifica se há cliente associado */}
        {clienteInfo.id ? (
          /* Demais campos */
          fields.map((field) => (
            <Box key={field.label} sx={{ mb: 1.5 }}>
              <Typography
                component="span"
                fontWeight="600"
                sx={{
                  color: "primary.main",
                  fontSize: "0.875rem",
                  display: "block",
                  mb: 0.5
                }}
              >
                {field.label}:
              </Typography>
              <Typography
                component="span"
                sx={{
                  color: "text.primary",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                {field.value || "Não informado"}
              </Typography>
            </Box>
          ))
        ) : (
          /* Estado sem cliente associado */
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
                mb: 1
              }}
            >
              Nenhum cliente associado
            </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem"
                }}
              >
                Clique no ícone de editar para associar um cliente
            </Typography>
          </Box>
        )}
      </CardContent>

      <BaseIconButton onClick={() => setEditingClient(true)} sx={{ position: "absolute", top: 4, right: 4 }}>
        <EditIcon fontSize="small" />
      </BaseIconButton>
       {/* Dialog para selecionar o cliente atrelado */}

      <Dialog open={editingClient} onClose={() => setEditingClient(false)} maxWidth="md" fullWidth={true}>
         <DialogTitle sx={{color: 'primary.main'}}>Selecionar Cliente associado</DialogTitle>
         <DialogContent sx={{minHeight: 300}}>
            <OptionsField
                options={clientOptions}
                label={"Cliente"}
                value={formData.id_usuario}
                onChange={(optionId) => { 
                    console.log(optionId);
                    setFormData({
                    ...formData,
                    id_usuario: Number(optionId),
                    })
                }}
        />
         </DialogContent>
         <DialogActions>
            <BaseButton onClick={() => handleChangeAssociatedClient()}>Salvar</BaseButton>
            <BaseCancelButton onClick={() => setEditingClient(false)}>Cancelar</BaseCancelButton>
         </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EquipamentoCliente;
