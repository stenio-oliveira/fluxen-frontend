import type { GridColDef } from '@mui/x-data-grid';
import HeaderFilter from '../components/shared/HeaderFilter';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setFilters, setEditingEquipamento, setDeletingEquipamento } from '../redux/slices/equipamentosTableSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const useEquipamentoColumns = () => {

  const dispatch = useDispatch();
  const {filters} = useSelector((state: RootState) => state.equipamentosTable);
  const handleChangeFilters = (field: string, value: string) => {
    dispatch(setFilters({ 
      ...filters, 
      columnFilters: { 
        ...filters.columnFilters, 
        [field]: value 
      } 
    }));
  };

  const handleEdit = (id: number) => {
    dispatch(setEditingEquipamento(id));
  };

  const handleDelete = (id: number) => {
    dispatch(setDeletingEquipamento(id));
  };

  const columns: GridColDef[] = [
    { 
      field: "id", 
      headerName: "ID", 
      flex: 1,
      disableColumnMenu: true,
      renderHeader : (params: any ) => { 
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            {/* <Typography sx={{fontSize: '12px', color: "primary.main"}}>ID</Typography> */}
            <HeaderFilter
              key={"id"}
              label={"ID"}
              field={"id"}
              type={"number"}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      }
    },
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
            <Typography
              sx={{
                fontSize: "12px",
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              {params.row.nome}
            </Typography>
          </Box>
        );
      },
      renderHeader : ( ) => { 
        return (
          <Box sx={{ width: "100%" }}>
            {/* <Typography sx={{fontSize: '12px', color: "primary.main"}}>Nome</Typography> */}
            <HeaderFilter
              key={"nome"}
              label={"Equipamento"}
              field={"nome"}
              type={"string"}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      }
    },
    {
      field: "cliente_nome",
      headerName: "Nome do Cliente",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: "12px",
                color: params.row.cliente_nome ? "text.primary" : "text.secondary",
                fontWeight: params.row.cliente_nome ? "500" : "400",
                fontStyle: params.row.cliente_nome ? "normal" : "italic"
              }}
            >
              {params.row.cliente_nome || "Sem cliente associado"}
            </Typography>
          </Box>
        );
      },
      renderHeader : ( ) => { 
        return (
          <Box sx={{ width: "100%" }}>
            <HeaderFilter
              key={"cliente_nome"}
              label={"Cliente"}
              field={"cliente_nome"}
              type={"string"}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      }
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <EditIcon
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={() => handleEdit(params.row.id)}
            />
            <DeleteIcon
              sx={{ cursor: "pointer", color: "error.main" }}
              onClick={() => handleDelete(params.row.id)}
            />
          </Box>
        );
      },
    },
  ];

  return {
    columns
  };
}

export default useEquipamentoColumns

