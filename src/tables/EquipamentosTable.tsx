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
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, Stack, useMediaQuery, useTheme } from "@mui/material";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import EquipamentoForm from "../components/EquipamentoForm";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import { useClientOptions } from "../hooks/useClientOptions";
import EquipmentsCardView from "../components/equipamentos/EquipmentsCardView";

export default function EquipamentosTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {user} = useSelector((state: RootState) => state.user);
  console.log("user", user)
  const {columns } = useEquipamentoColumns();
  const {rows, filters, creatingEquipamento, editingEquipamento, deletingEquipamento} = useSelector((state: RootState) => state.equipamentosTable);
  const { clientOptions } = useClientOptions();
  
  console.log("EquipamentosTable - clientOptions:", clientOptions);
  console.log("EquipamentosTable - clientOptions.length:", clientOptions.length);

  // Verificar se o usuário é ADM ou gestor
  const isAdmin = user?.perfil_nome === 'ADM';
  const isGestor = user?.is_gestor === true;
  const canManageEquipments = isAdmin || isGestor; // Admin ou gestor podem gerenciar equipamentos
  const canDelete = isAdmin || isGestor; // Admin ou gestor podem deletar

  // Paginação para mobile
  const [cardPage, setCardPage] = useState(1);
  const itemsPerPage = isMobile ? 10 : 100;
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (cardPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = isMobile ? rows.slice(startIndex, endIndex) : rows;

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

  // Resetar página quando os filtros mudarem
  useEffect(() => {
    setCardPage(1);
  }, [filters]);
  
  const handleCardPageChange = (newPage: number) => {
    setCardPage(newPage);
    // Scroll para o topo quando mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 1 : 0.5,
      }}
    >
      <Stack 
        direction={isMobile ? "column" : "row"} 
        justifyContent="space-between"
        gap={isMobile ? 1 : 0}
        sx={{
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <Search
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeGeneralFilter(e.target.value)
          }
        />
        {canManageEquipments && (
          <BaseCreateButton
            onClick={handleCreateEquipamento}
          />
        )}
      </Stack>

      {/* Renderização condicional: Cards no mobile, Tabela no desktop */}
      {isMobile ? (
        <EquipmentsCardView
          equipments={paginatedRows}
          loading={false}
          isAdmin={isAdmin}
          canDelete={canDelete}
          page={cardPage}
          totalPages={totalPages}
          onPageChange={handleCardPageChange}
        />
      ) : (
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
      )}

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
