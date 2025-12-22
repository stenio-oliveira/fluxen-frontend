import { useDispatch, useSelector } from "react-redux";
import { Box, Dialog, DialogContent, DialogTitle, Stack, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useCallback, useState } from "react";
import { setRows, setCreatingCliente, setDeletingCliente, setFilters, removeCliente } from "../redux/slices/clientesTableSlice";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useClientColumns } from "../hooks/useClientColumns";
import Search from "../components/Search";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import ClienteForm from "../components/ClienteForm";
import type { RootState } from "../redux/store";
import ClienteService from "../services/clienteService";
import { tableStyles } from "../styles";
import ClientsCardView from "../components/clientes/ClientsCardView";

const ClientesTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.user);
  const { rows, filters, creatingCliente, editingCliente, deletingCliente } = useSelector((state: RootState) => state.clientesTable);
  const { columns } = useClientColumns();

  // Paginação para mobile
  const [cardPage, setCardPage] = useState(1);
  const itemsPerPage = isMobile ? 10 : 100;
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (cardPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = isMobile ? rows.slice(startIndex, endIndex) : rows;

  const changeGeneralFilter = (value: string) => {
    dispatch(
      setFilters({
        generalFilter: value,
        columnFilters: filters.columnFilters,
      })
    );
  };

  const handleDeleteCliente = async () => {
    console.log("deletingCliente", deletingCliente);

    try {
      if (deletingCliente === null) return;
      await ClienteService.deleteCliente(deletingCliente);
      dispatch(removeCliente(deletingCliente));
      dispatch(setDeletingCliente(null));
      dispatch(setFeedback({ message: "Cliente deletado com sucesso", type: "success" }));
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao deletar cliente: ${e}`, type: "error" }));
    }
  };

  const fetchClientes = useCallback(async () => {
    try {
      if (!user) return;
      const clientes = await ClienteService.getClientes(user, filters);
      dispatch(setRows(clientes));
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar clientes: ${e}`, type: "error" }));
    }
  }, [dispatch, filters, user]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

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
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", gap: isMobile ? 1 : 0.5 }}>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        justifyContent="space-between"
        gap={isMobile ? 1 : 0}
        sx={{
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <Search onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeGeneralFilter(e.target.value)} />
        <BaseCreateButton onClick={() => dispatch(setCreatingCliente(true))} />
      </Stack>

      {/* Renderização condicional: Cards no mobile, Tabela no desktop */}
      {isMobile ? (
        <ClientsCardView
          clients={paginatedRows}
          loading={false}
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
          checkboxSelection={false}
          pageSizeOptions={[100]}
          disableRowSelectionOnClick
          hideFooter={false}
        />
      )}
      <Dialog open={creatingCliente || editingCliente !== null} maxWidth="lg" fullWidth>
        <DialogTitle>{creatingCliente ? "Criar Cliente" : "Editar Cliente"}</DialogTitle>
        <DialogContent>
          <ClienteForm />
        </DialogContent>
      </Dialog>
      <BaseDeleteDialog
        open={deletingCliente !== null}
        onConfirm={handleDeleteCliente}
        onCancel={() => dispatch(setDeletingCliente(null))}
      />
    </Box>
  );
};

export default ClientesTable;
