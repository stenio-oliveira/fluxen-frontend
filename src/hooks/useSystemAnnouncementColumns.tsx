import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setDeletingAnnouncement, setEditingAnnouncement, setFilters } from '../redux/slices/systemAnnouncementsTableSlice';
import HeaderFilter from '../components/shared/HeaderFilter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography, Chip } from '@mui/material';
import type { SystemAnnouncementType } from '../types/SystemAnnouncement';

const getTypeColor = (type: SystemAnnouncementType) => {
  switch (type) {
    case 'CONTINGENCY':
      return 'error';
    case 'CRITICAL':
      return 'error';
    case 'MAINTENANCE':
      return 'warning';
    case 'INFO':
      return 'info';
    default:
      return 'default';
  }
};

const getTypeLabel = (type: SystemAnnouncementType) => {
  switch (type) {
    case 'CONTINGENCY':
      return 'Contingência';
    case 'CRITICAL':
      return 'Crítico';
    case 'MAINTENANCE':
      return 'Manutenção';
    case 'INFO':
      return 'Informação';
    default:
      return type;
  }
};

export const useSystemAnnouncementColumns = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.systemAnnouncementsTable);
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
      field: 'title',
      headerName: 'Título',
      flex: 2,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'title'}
              label={'Título'}
              field={'title'}
              type={'string'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      },
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 'bold' }}>
            {params.row.title}
          </Typography>
        </Box>
      )
    },
    {
      field: 'type',
      headerName: 'Tipo',
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'type'}
              label={'Tipo'}
              field={'type'}
              type={'string'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      },
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Chip
            label={getTypeLabel(params.row.type)}
            color={getTypeColor(params.row.type)}
            size="small"
            sx={{ fontSize: '11px', height: '24px' }}
          />
        </Box>
      )
    },
    {
      field: 'is_active',
      headerName: 'Ativo',
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (params: any) => {
        const { colDef } = params;
        return (
          <Box sx={{ width: colDef.width }}>
            <HeaderFilter
              key={'is_active'}
              label={'Ativo'}
              field={'is_active'}
              type={'string'}
              onFilterChange={handleChangeFilters}
            />
          </Box>
        );
      },
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Chip
            label={params.row.is_active ? 'Sim' : 'Não'}
            color={params.row.is_active ? 'success' : 'default'}
            size="small"
            sx={{ fontSize: '11px', height: '24px' }}
          />
        </Box>
      )
    },
    {
      field: 'starts_at',
      headerName: 'Início',
      flex: 1.5,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px' }}>
            {params.row.starts_at ? new Date(params.row.starts_at).toLocaleString('pt-BR') : '-'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'ends_at',
      headerName: 'Fim',
      flex: 1.5,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px' }}>
            {params.row.ends_at ? new Date(params.row.ends_at).toLocaleString('pt-BR') : '-'}
          </Typography>
        </Box>
      )
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
            <EditIcon sx={{ cursor: 'pointer', color: 'primary.main' }} onClick={() => dispatch(setEditingAnnouncement(row.id))} />
            <DeleteIcon sx={{ cursor: 'pointer', color: 'error.main', ml: 1 }} onClick={() => dispatch(setDeletingAnnouncement(row.id))} />
          </Box>
        );
      }
    }
  ];

  return { columns };
};
