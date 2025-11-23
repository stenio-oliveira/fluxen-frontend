import { useMetricaColumns } from "../hooks/useMetricaColumns";
import { removeMetrica, setCreatingMetrica, setDeletingMetrica, setFilters, setRows } from "../redux/slices/metricasTableSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import MetricaService from "../services/metricaService";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useEffect, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Stack, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tableStyles } from "../styles";
import Search from "../components/Search";
import MetricaForm from "../components/MetricaForm";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import MetricasCardView from "../components/metricas/MetricasCardView";

const MetricasTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { rows, filters, creatingMetrica, editingMetrica, deletingMetrica } = useSelector((state: RootState) => state.metricasTable);
  const { columns } = useMetricaColumns();

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

  const handleDeleteMetrica = async  (id: number) => {
    try{  
      await MetricaService.deleteMetrica(id);
      dispatch(removeMetrica(id));
      dispatch(setDeletingMetrica(null));
      dispatch(setFeedback({ message: 'Métrica deletada com sucesso', type: 'success' }));
    }catch(e: any) {
      dispatch(
        setFeedback({ message: `Erro ao deletar metrica: ${e}`, type: 'error' })
      );
    }
  }



  const fetchMetrics = async () => {
    try {
      const metrics = await MetricaService.getMetricas(filters);
      dispatch(setRows(metrics));
    } catch (e: any) {
      dispatch(
        setFeedback({ message: `Erro ao buscar meticas: ${e}`, type: 'error' })
      );
    }
  };


  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  // Resetar página quando os filtros mudarem
  useEffect(() => {
    setCardPage(1);
  }, [filters]);

  useEffect(() => {
   console.log("deletingMetrica", deletingMetrica);
  }, [deletingMetrica]);

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
        <BaseCreateButton onClick={() => dispatch(setCreatingMetrica(true))} />
      </Stack>

      {/* Renderização condicional: Cards no mobile, Tabela no desktop */}
      {isMobile ? (
        <MetricasCardView
          metricas={paginatedRows}
          loading={false}
          page={cardPage}
          totalPages={totalPages}
          onPageChange={handleCardPageChange}
        />
      ) : (
        <DataGrid
          rows={rows}
          getRowId={(row) => row.id}
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
     

      <Dialog open={creatingMetrica || editingMetrica !== null}>
        <DialogTitle>
          {creatingMetrica ? "Criar Metrica" : "Editar Metrica"}
        </DialogTitle>
        <DialogContent>
          <MetricaForm />
        </DialogContent>
      </Dialog>

      <BaseDeleteDialog
        open={deletingMetrica !== null}
        onConfirm={() => {
          if (!deletingMetrica) return;
          handleDeleteMetrica(deletingMetrica);
        }}
        onCancel={() => dispatch(setDeletingMetrica(null))}
      />
    </Box>
  );
};

export default MetricasTable;
