import { useMetricaColumns } from "../hooks/useMetricaColumns";
import { removeMetrica, setCreatingMetrica, setDeletingMetrica, setFilters, setRows } from "../redux/slices/metricasTableSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import MetricaService from "../services/metricaService";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useEffect } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tableStyles } from "../styles";
import Search from "../components/Search";
import MetricaForm from "../components/MetricaForm";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";

const MetricasTable = () => {
  const dispatch = useDispatch();
  const { rows, filters, creatingMetrica, editingMetrica, deletingMetrica } = useSelector((state: RootState) => state.metricasTable);
  const { columns } = useMetricaColumns();

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

  useEffect(() => {
   console.log("deletingMetrica", deletingMetrica);
  }, [deletingMetrica]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,

      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Search
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeGeneralFilter(e.target.value)
          }
        />
        <BaseCreateButton onClick={() => dispatch(setCreatingMetrica(true))} />
      </Stack>
     
        <DataGrid
          rows={[...rows, ...rows, ...rows]}
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
