import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setDeletingUser, setEditingUser, setFilters } from '../redux/slices/usersTableSlice';
import HeaderFilter from '../components/shared/HeaderFilter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography } from '@mui/material';

export const useUserColumns = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.usersTable);
  
  const handleChangeFilters = (field: string, value: string) => {
    dispatch(setFilters({
      ...filters,
      columnFilters: {
        ...filters.columnFilters,
        [field]: value
      }
    }));
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'id'}
              label={'ID'}
              field={'id'}
              type={'number'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      }
    },
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'nome'}
              label={'Nome'}
              field={'nome'}
              type={'string'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      },
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 'bold' }}>
            {params.row.nome}
          </Typography>
        </Box>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'email'}
              label={'Email'}
              field={'email'}
              type={'string'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      }
    },
    {
      field: 'username',
      headerName: 'Usuário',
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'username'}
              label={'Usuário'}
              field={'username'}
              type={'string'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <EditIcon 
              sx={{ cursor: 'pointer', color: 'primary.main' }} 
              onClick={() => dispatch(setEditingUser(row.id))} 
            />
            <DeleteIcon 
              sx={{ cursor: 'pointer', color: 'error.main', ml: 1 }} 
              onClick={() => dispatch(setDeletingUser(row.id))} 
            />
          </Box>
        );
      }
    }
  ];

  return { columns };
};

export default useUserColumns;
