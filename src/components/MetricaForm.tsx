import React, { useEffect, useState } from 'react'
import type { Metrica } from '../types/Metrica';
import { Box, Stack } from '@mui/material';
import Input from './shared/Input';
import MetricaService from '../services/metricaService';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setFeedback } from '../redux/slices/feedBackSlice';
import { addMetrica, replaceMetrica, setCreatingMetrica, setEditingMetrica } from '../redux/slices/metricasTableSlice';
import { BaseButton } from './shared/Button';
import { BaseCancelButton } from './shared/BaseCancelButton';

// export interface Metrica {
//   id: number;
//   nome: string;
//   unidade: string;

//   valor_minimo?: number;
//   valor_maximo?: number;
// }


const MetricaForm = () => {
  const dispatch = useDispatch();
    const [formData, setFormData] = useState<Partial<Metrica>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const {creatingMetrica, editingMetrica } = useSelector((state: RootState) => state.metricasTable);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

      // Limpar erro de validação quando o usuário começar a digitar
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar campos obrigatórios
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = 'Nome é obrigatório';
    }

    if (!formData.unidade || formData.unidade.trim() === '') {
      errors.unidade = 'Unidade é obrigatória';
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
            if(creatingMetrica){ 
                const metrica = await MetricaService.createMetrica(formData);
                if (metrica) {
                  dispatch(addMetrica(metrica));
                  dispatch(
                    setFeedback({
                      message: "Métrica criada com sucesso",
                      type: "success",
                    })
                  );
                  dispatch(setCreatingMetrica(false));
                }
                return;
            }
            if(editingMetrica){ 
                const metrica = await MetricaService.updateMetrica(editingMetrica, formData);
                if (metrica) {
                  dispatch(replaceMetrica(metrica));
                  dispatch(
                    setFeedback({
                      message: "Métrica atualizada com sucesso",
                      type: "success",
                    })
                  );
                  dispatch(setEditingMetrica(null));
                }
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    const fields = [
        { 
            label: 'Nome', 
        name: 'nome',
        required: true
        },
        { 
            label: 'Unidade', 
          name: 'unidade',
          required: true
        },
    ]

    const fetchMetrica = async () => {
      if(!editingMetrica) return;
      try {
        if (editingMetrica) {
          const metrica = await MetricaService.getMetricaById(editingMetrica);
          setFormData({
            nome: metrica?.nome,
            unidade: metrica?.unidade,
          });
        }
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: `Erro ao buscar metrica: ${e}`,
            type: "error",
          })
        );
      }
    };

    useEffect(() => {
      if (creatingMetrica) {
        // Reset form data when creating new metric
        setFormData({});
        setValidationErrors({});
      } else {
        fetchMetrica();
      }
    }, [editingMetrica, creatingMetrica]);


  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map((field) => (
        <Box key={field.name}>
          <Input
            value={String(formData[field.name as keyof Metrica] || "")}
            name={field.name}
            onChange={handleChange}
            label={field.label}
            id={field.name}
            required={field.required}
          />
          {validationErrors[field.name] && (
            <span className="mt-1 text-xs text-red-500">
              {validationErrors[field.name]}
            </span>
          )}
        </Box>
      ))}
      <Stack direction="row" spacing={2}>
        {creatingMetrica ? (
          <BaseButton onClick={handleSubmit}>Criar</BaseButton>
        ) : (
          <BaseButton onClick={handleSubmit}>Salvar</BaseButton>
        )}
        <BaseCancelButton
          onClick={() => {
            setFormData({}); // Reset form data
            setValidationErrors({}); // Reset validation errors
            if (creatingMetrica) {
              dispatch(setCreatingMetrica(false));
              return;
            }
            if (editingMetrica) {
              dispatch(setEditingMetrica(null));
              return;
            }
          }}
        >
          Cancelar
        </BaseCancelButton>
      </Stack>
    </Box>
  );
}

export default MetricaForm