import React, { useCallback, useEffect, useState } from "react";
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
      setClientInfo(client);
      console.log(client);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 400, boxShadow: "none", position: "relative" }}
    >
      <CardContent className="bg-gray-50">
        {/* Nome da empresa */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {/* {clienteInfo.empresa} */}
        </Typography>

        {/* Demais campos */}
        {fields.map((field, index) => (
          <Box key={field.label}>
            <Typography component="span" fontWeight="bold">
              {field.label}:
            </Typography>
            <Typography component="span" sx={{ ml: 1 }}>
              {field.value}
            </Typography>
          </Box>
        ))}
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
