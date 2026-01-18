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
  id_cliente?: number;
}

interface EquipamentoFormProps {
  disabled?: boolean;
}

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const [formData, setFormData] = React.useState<EquipmentForm>({
    nome: '',

  });
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [equipamentoId, setEquipamentoId] = React.useState<number | null>(null);
  const editingEquipamento = useSelector((state: RootState) => state.equipamentosTable.editingEquipamento);
  const {clientOptions } = useClientOptions();

  const fields = [
    { label: 'Equipamento', name: 'nome' },
  ];
  const optionFields = [
    { label: 'Cliente', name: 'id_cliente' },
  ];

  const resetFormData = ( ) => { 
      fetchDataCallback();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('handleChange - name:', name, 'value:', value);
    
    // Limitar o campo nome a 28 caracteres
    const limitedValue = name === 'nome' && value.length > 28 ? value.slice(0, 28) : value;
    
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: limitedValue };
      console.log('handleChange - newData:', newData);
      return newData;
    });

    // Limpar erro de validação quando o usuário começar a digitar
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClientChange = (value: string | number) => {
    setFormData({ ...formData, id_cliente: value ? Number(value) : undefined });

    // Limpar erro de validação do cliente
    if (validationErrors.id_cliente) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.id_cliente;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar campos obrigatórios
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = 'Nome do equipamento é obrigatório';
    } else if (formData.nome.length > 28) {
      errors.nome = 'Nome do equipamento deve ter no máximo 28 caracteres';
    }

    // Validação específica para criação (quando não há id)
    if (!id && !equipamentoId) {
      if (!formData.id_cliente) {
        errors.id_cliente = 'Cliente é obrigatório';
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
          message: "Por favor, preencha todos os campos obrigatórios",
          type: "error",
        })
      );
      return;
    }

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
          id_cliente: equip.id_cliente
        });
        setEquipamentoId(equip.id);
        setValidationErrors({});
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
                name={field.name}
                value={formData[field.name as keyof EquipmentForm] || ''}
                onChange={handleChange}
                disabled={disabled}
                required
                maxLength={field.name === 'nome' ? 28 : undefined}
              />
              {validationErrors[field.name] && (
                <span className="mt-1 text-xs text-red-500">
                  {validationErrors[field.name]}
                </span>
              )}
            </Stack>
          );
        })}
        {!id && optionFields.map((field) => {
          return (
            <Stack
              key={field.name}
              direction={"column"}
              alignItems={"flex-start"}
              sx={{ width: "100%" }}
            >
              <OptionsField
                options={clientOptions}
                label={field.label}
                value={formData[field.name as keyof EquipmentForm]}
                onChange={handleClientChange}
                disabled={disabled}
                required
              />
              {validationErrors[field.name] && (
                <span className="mt-1 text-xs text-red-500">
                  {validationErrors[field.name]}
                </span>
              )}
            </Stack>
          );
        })}
      </Box>
      {!disabled && (
        <Stack direction={"row"} justifyContent="flex-end" gap={2} width={"100%"}>
          <BaseButton type="submit" onClick={handleSubmit}>
            Salvar
          </BaseButton>
          <BaseCancelButton
            onClick={() => { 
              setValidationErrors({});
              if (id) {
                resetFormData()
              }
              dispatch(setCreatingEquipamento(false));
              dispatch(setEditingEquipamento(null));
            }}
          >
            Cancelar
          </BaseCancelButton>
        </Stack>
      )}
    </Box>
  );
}

export default EquipamentoForm