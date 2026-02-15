import { useDispatch, useSelector } from "react-redux";
import { Box, Dialog, DialogContent, DialogTitle, Stack, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useCallback } from "react";
import { setRows, setCreatingAnnouncement, setDeletingAnnouncement, setFilters, removeAnnouncement } from "../redux/slices/systemAnnouncementsTableSlice";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { useSystemAnnouncementColumns } from "../hooks/useSystemAnnouncementColumns";
import Search from "../components/Search";
import { BaseCreateButton } from "../components/shared/BaseCreateButton";
import BaseDeleteDialog from "../components/shared/BaseDeleteDialog";
import SystemAnnouncementForm from "../components/SystemAnnouncementForm";
import type { RootState } from "../redux/store";
import SystemAnnouncementService from "../services/systemAnnouncementService";
import { tableStyles } from "../styles";

const SystemAnnouncementsTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { rows, filters, creatingAnnouncement, editingAnnouncement, deletingAnnouncement } = useSelector((state: RootState) => state.systemAnnouncementsTable);
  const { columns } = useSystemAnnouncementColumns();

  const changeGeneralFilter = (value: string) => {
    dispatch(
      setFilters({
        generalFilter: value,
        columnFilters: filters.columnFilters,
      })
    );
  };

  const handleDeleteAnnouncement = async () => {
    try {
      if (deletingAnnouncement === null) return;
      await SystemAnnouncementService.deleteAnnouncement(deletingAnnouncement);
      dispatch(removeAnnouncement(deletingAnnouncement));
      dispatch(setDeletingAnnouncement(null));
      dispatch(setFeedback({ message: "Anúncio deletado com sucesso", type: "success" }));
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao deletar anúncio: ${e}`, type: "error" }));
    }
  };

  const fetchAnnouncements = useCallback(async () => {
    try {
      const announcements = await SystemAnnouncementService.getAnnouncements(filters);
      dispatch(setRows(announcements));
    } catch (e: any) {
      dispatch(setFeedback({ message: `Erro ao buscar anúncios: ${e}`, type: "error" }));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

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
        <BaseCreateButton onClick={() => dispatch(setCreatingAnnouncement(true))} />
      </Stack>

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
      
      <Dialog open={creatingAnnouncement || editingAnnouncement !== null} maxWidth="lg" fullWidth>
        <DialogTitle>{creatingAnnouncement ? "Criar Anúncio" : "Editar Anúncio"}</DialogTitle>
        <DialogContent>
          <SystemAnnouncementForm />
        </DialogContent>
      </Dialog>
      
      <BaseDeleteDialog
        open={deletingAnnouncement !== null}
        onConfirm={handleDeleteAnnouncement}
        onCancel={() => dispatch(setDeletingAnnouncement(null))}
      />
    </Box>
  );
};

export default SystemAnnouncementsTable;
