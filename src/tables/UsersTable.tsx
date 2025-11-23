import Box from "@mui/material/Box";
import { DataGrid, type GridCellParams } from "@mui/x-data-grid";
import useUserColumns from "../hooks/useUserColumns";
import Search from "../components/Search";
import { tableStyles } from "../styles";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setFeedback } from "../redux/slices/feedBackSlice";
import UsuarioService from "../services/usuarioService";
import { removeUser, setCreatingUser, setDeletingUser, setFilters, setRows } from "../redux/slices/usersTableSlice";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, Stack, useMediaQuery, useTheme } from "@mui/material";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import UserForm from "../components/UserForm";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import UsersCardView from "../components/usuarios/UsersCardView";

export default function UsersTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {user} = useSelector((state: RootState) => state.user);
  const {columns } = useUserColumns();
  const {rows, filters, creatingUser, editingUser, deletingUser} = useSelector((state: RootState) => state.usersTable);

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
      if (!deletingUser) return;
      await UsuarioService.deleteUsuario(deletingUser);
      dispatch(removeUser(deletingUser));
      dispatch(setDeletingUser(null));
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: `Erro ao deletar usuário: ${e}`,
          type: "error",
        })
      );
    }
  };

  const handleCellClick =(params: GridCellParams ) => { 
      const {field } = params;
      if(field === 'actions' ) return;
      navigate(`/usuarios/${params.id}`);
  }

  const fetchUsers = useCallback( async () => { 
    try{  
        if(!user) return;

        const users = await UsuarioService.getUsuarios(user, filters);
        
        dispatch(setRows(users));
    }catch(e: any){ 
      dispatch(setFeedback({ message: `Erro ao buscar usuários: ${e}`, type: 'error'}));
    }
  }, [dispatch, filters, user]);

  useEffect(() => { 
    fetchUsers();
  }, [fetchUsers]);

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
        <BaseCreateButton
          onClick={() => dispatch(setCreatingUser(true))}
        />
      </Stack>

      {/* Renderização condicional: Cards no mobile, Tabela no desktop */}
      {isMobile ? (
        <UsersCardView
          users={paginatedRows}
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
        open={creatingUser || editingUser !== null}
        fullWidth
      >
        <DialogTitle>
          {creatingUser ? "Criar Usuário" : "Editar Usuário"}
        </DialogTitle>
        <DialogContent>
          <UserForm />
        </DialogContent>
      </Dialog>

     <BaseDeleteDialog
        open={deletingUser !== null}
        onCancel={() => dispatch(setDeletingUser(null))}
        onConfirm={() => handleDelete()}
        />
    </Box>
  );
}
