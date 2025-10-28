import Box from "@mui/material/Box";
import { DataGrid, type GridCellParams } from "@mui/x-data-grid";
import useEquipamentoColumns from "../hooks/useEquipamentoColumns";
import Search from "../components/Search";
import { tableStyles } from "../styles";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setFeedback } from "../redux/slices/feedBackSlice";
import EquipamentoService from "../services/equipamentoService";
import { removeEquipamento, setCreatingEquipamento, setDeletingEquipamento, setFilters, setRows } from "../redux/slices/equipamentosTableSlice";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import EquipamentoForm from "../components/EquipamentoForm";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import { useClientOptions } from "../hooks/useClientOptions";

export default function EquipamentosTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state: RootState) => state.user);
  console.log("user", user)
  const {columns } = useEquipamentoColumns();
  const {rows, filters, creatingEquipamento, editingEquipamento, deletingEquipamento} = useSelector((state: RootState) => state.equipamentosTable);
  const { clientOptions } = useClientOptions();

  // Verificar se o usuário é ADM
  const isAdmin = user?.perfil_nome === 'ADM';

  const changeGeneralFilter = (value: string ) => { 
      dispatch(setFilters({ 
        generalFilter: value,
        columnFilters: filters.columnFilters
      }));
  }

  const handleDelete = async () => {
    try {
      if (!deletingEquipamento) return;
      await EquipamentoService.deleteEquipamento(deletingEquipamento);
      dispatch(removeEquipamento(deletingEquipamento));
      dispatch(setDeletingEquipamento(null));
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: `Erro ao deletar equipamento: ${e}`,
          type: "error",
        })
      );
    }
  };

  const handleCellClick =(params: GridCellParams ) => { 
      const {field } = params;
      if(field === 'actions' ) return;
      navigate(`/equipamentos/${params.id}`);
  }

  const handleCreateEquipamento = () => {
    // Verificar se existem clientes disponíveis
    if (clientOptions.length === 0) {
      dispatch(
        setFeedback({
          message: "Não é possível cadastrar um equipamento sem nenhum cliente para vinculá-lo. Cadastre pelo menos um cliente primeiro.",
          type: "error",
        })
      );
      return;
    }

    // Se existem clientes, abrir o modo de criação
    dispatch(setCreatingEquipamento(true));
  };

  const fetchEquipments = useCallback( async () => { 
    console.log("fetchEquipments")
    try{  
      console.log("user", user)
        if(!user) return;
     
        const equips = await EquipamentoService.getEquipamentos(user, filters);
        
        dispatch(setRows(equips));
    }catch(e: any){ 
      dispatch(setFeedback({ message: `Erro ao buscar equipamentos: ${e}`, type: 'error'}));
    }
  }, [dispatch, filters, user]);

  useEffect(() => { 
    fetchEquipments();
  }, [fetchEquipments]);
  
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Search
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeGeneralFilter(e.target.value)
          }
        />
        {isAdmin && (
          <BaseCreateButton
            onClick={handleCreateEquipamento}
          />
        )}
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={32}
        sx={tableStyles}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        // onRowClick={() => navigate("/equipamentos/1")}
        onCellClick={(params) =>{ 
          handleCellClick(params);
        }}
        checkboxSelection={false}
        pageSizeOptions={[100]}
        disableRowSelectionOnClick
        hideFooter={false}
      />

      <Dialog
        open={creatingEquipamento || editingEquipamento !== null}
        fullWidth
      >
        <DialogTitle>
          {creatingEquipamento ? "Criar Equipamento" : "Editar Equipamento"}
        </DialogTitle>
        <DialogContent>
          <EquipamentoForm />
        </DialogContent>
      </Dialog>


     <BaseDeleteDialog
        open={deletingEquipamento !== null}
        onCancel={() => dispatch(setDeletingEquipamento(null))}
        onConfirm={() => handleDelete()}
        />
    </Box>
  );
}
