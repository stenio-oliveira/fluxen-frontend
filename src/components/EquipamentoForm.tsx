import { Box, Stack } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import Input from './shared/Input'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EquipamentoService from '../services/equipamentoService';
import { setFeedback } from '../redux/slices/feedBackSlice';
import { BaseButton } from './shared/Button';
import type { RootState } from '../redux/store';
import { addEquipamento, replaceEquipamento, setCreatingEquipamento, setEditingEquipamento } from '../redux/slices/equipamentosTableSlice';
import { useClientOptions } from '../hooks/useClientOptions';
import OptionsField from './shared/OptionsField';
import { BaseCancelButton } from './shared/BaseCancelButton';


export interface EquipmentForm {
  nome: string;
  id_usuario?: number;
}

const EquipamentoForm = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const [formData, setFormData] = React.useState<EquipmentForm>({
    nome: '',
  });
  const [equipamentoId, setEquipamentoId] = React.useState<number | null>(null);
  const editingEquipamento = useSelector((state: RootState) => state.equipamentosTable.editingEquipamento);
  const {clientOptions } = useClientOptions();

  const fields = [
    {label: 'Equipamento', name: 'nome'},
  ];
  const optionFields = [
    {label: 'Cliente', name: 'id_usuario'},
  ];

  const resetFormData = ( ) => { 
      fetchDataCallback();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (equipamentoId) {
        const updatedEquip = await EquipamentoService.updateEquipamento(
          Number(equipamentoId),
          formData
        );
        dispatch(replaceEquipamento(updatedEquip));
        dispatch(setEditingEquipamento(null));
        dispatch(
          setFeedback({
            message: "Equipamento atualizado com sucesso",
            type: "success",
          })
        );
        return;
      }
      //create
      const newEquip = await EquipamentoService.createEquipamento(formData);
      dispatch(addEquipamento(newEquip));
      dispatch(setCreatingEquipamento(false));
      dispatch(
        setFeedback({
          message: "Equipamento criado com sucesso",
          type: "success",
        })
      );

    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao criar equipamento: ${error}`,
          type: "error",
        })
      );
    }
  };

  const fetchDataCallback = useCallback(async () => {
    try {
      if (editingEquipamento || id) {
        const equip = await EquipamentoService.getEquipamentoById(
          Number(editingEquipamento || id)
        );
        console.log(equip);
        setFormData({
          nome: equip.nome,
          id_usuario: equip.id_usuario
        });
        setEquipamentoId(equip.id);
      }
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao buscar equipamento: ${error}`,
          type: "error",
        })
      );
    }
  }, [editingEquipamento]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",

      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        {fields.map((field) => {
          return (
            <Stack
              key={field.label}
              direction={"column"}
              alignItems={"flex-start"}
              sx={{ width: "100%" }}
            >
              <Input
                key={field.label}
                label={field.label}
                value={formData[field.name as keyof EquipmentForm]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]: e.target.value,
                  })
                }
              />
            </Stack>
          );
        })}
        {!id && optionFields.map((field) => {
          return (
            <OptionsField
              options={clientOptions}
              key={field.name}
     
              label={field.label}
              value={formData[field.name as keyof EquipmentForm]}
              onChange={(e) => setFormData({ ...formData, [field.name]: e })}
            />
          );
        })}
      </Box>
      <Stack direction={"row"} justifyContent="flex-end" gap={2} width={"100%"}>
        <BaseButton type="submit" onClick={handleSubmit}>
          Salvar
        </BaseButton>
        <BaseCancelButton
          onClick={() => { 

            if(id){ 
              resetFormData()
            }
            dispatch(setCreatingEquipamento(false));
            dispatch(setEditingEquipamento(null));
          }}
        >
          Cancelar
        </BaseCancelButton>
      </Stack>
    </Box>
  );
}

export default EquipamentoForm