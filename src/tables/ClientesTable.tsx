import { useDispatch, useSelector } from "react-redux";
import { Box, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { setRows, setCreatingCliente, setDeletingCliente, setFilters } from "../redux/slices/clientesTableSlice";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useClientColumns } from "../hooks/useClientColumns";
import Search from "../components/Search";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import ClienteForm from "../components/ClienteForm";
import type { RootState } from "../redux/store";
import UsuarioService from "../services/usuarioService";
import { tableStyles } from "../styles";

const ClientesTable = () => {
  const dispatch = useDispatch();
  const { rows, filters, creatingCliente, editingCliente, deletingCliente } = useSelector((state: RootState) => state.clientesTable);
  const { columns } = useClientColumns();

  const changeGeneralFilter = (value: string) => {
    dispatch(
      setFilters({
        generalFilter: value,
        columnFilters: filters.columnFilters,
      })
    );
  };

  const handleDeleteCliente = async (id: number) => {
    try {
      await UsuarioService.deleteUsuario(id);
      dispatch({ type: "clientesTable/removeCliente", payload: id });
      dispatch(setDeletingCliente(null));
      dispatch(setFeedback({ message: "Cliente deletado com sucesso", type: "success" }));
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao deletar cliente: ${e}`, type: "error" }));
    }
  };

  const fetchClientes = async () => {
    console.log("fetchCLientes")
    try {
      const clientes = await UsuarioService.getClientUsers(filters);
      dispatch(setRows(clientes));
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar clientes: ${e}`, type: "error" }));
    }
  };

  useEffect(() => {
    console.log("useEffect")
    fetchClientes();
  }, [filters]);

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Search onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeGeneralFilter(e.target.value)} />
        <BaseCreateButton onClick={() => dispatch(setCreatingCliente(true))} />
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={40}
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
      <Dialog open={creatingCliente || editingCliente !== null}>
        <DialogTitle>{creatingCliente ? "Criar Cliente" : "Editar Cliente"}</DialogTitle>
        <DialogContent>
          <ClienteForm />
        </DialogContent>
      </Dialog>
      <BaseDeleteDialog
        open={deletingCliente !== null}
        onConfirm={() => {
          if (!deletingCliente) return;
          handleDeleteCliente(deletingCliente);
        }}
        onCancel={() => dispatch(setDeletingCliente(null))}
      />
    </Box>
  );
};

export default ClientesTable;
