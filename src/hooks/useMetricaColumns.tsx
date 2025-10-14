import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import HeaderFilter from '../components/shared/HeaderFilter';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setDeletingMetrica, setEditingMetrica, setFilters } from '../redux/slices/metricasTableSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditButton from '../components/shared/EditButton';
import DeleteButton from '../components/shared/DeleteButton';

export const useMetricaColumns = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.metricasTable);
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
      field: "id", 
      headerName: "ID", 
      flex: 1,
      disableColumnMenu: true,
      renderHeader : (params: any) => {
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
      renderHeader : (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            {/* <Typography sx={{fontSize: '12px', color: "primary.main"}}>Nome</Typography> */}
            <HeaderFilter
              key={"nome"}
              label={"Nome"}
              field={"nome"}
              type={"string"}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      },
      renderCell: (params : GridRenderCellParams) => {
        return (
          <Box sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
            <Typography sx={{fontSize: '12px', color: "primary.main", fontWeight: "bold"}}>{params.row.nome}</Typography>
          </Box>
        );
      }
    },
    { 
      field: "unidade", 
      headerName: "Unidade", 
      flex: 1,
      disableColumnMenu: true,
      renderHeader : (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            {/* <Typography sx={{fontSize: '12px', color: "primary.main"}}>Unidade</Typography> */}
            <HeaderFilter
              key={"unidade"}
              label={"Unidade"}
              field={"unidade"}
              type={"string"}
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
      renderCell: (params : GridRenderCellParams) => {
        const {row} = params;
        return (
          <Box sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
             <EditButton onClick={()=> dispatch(setEditingMetrica(row.id))}/>
             <DeleteButton  onClick={()=> { 
               console.log("row.id", row.id);
               dispatch(setDeletingMetrica(row.id));
             }}/>
          </Box>
        );
      }
    }
  ];

  return { columns };

};


