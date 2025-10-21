import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import EquipamentoLogService from "../services/equipamentoLogService";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tableStyles } from "../styles";

interface TableData {
    columns: GridColDef[];
    rows: any[];
}

export default function EquipamentoLogGrupoTable() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTableData = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        try {
            const tableData: TableData = await EquipamentoLogService.getLogsTableData(Number(id));

            // Ensure columns have proper formatting for DataGrid
            const formattedColumns: GridColDef[] = tableData.columns.map(col => {
                const baseColumn = {
                    ...col,
                    sortable: true,
                    filterable: true,
                    resizable: true,
                };
                // Add valueGetter for dateTime columns to convert string to Date
                if (col.type === 'dateTime') {
                    return {
                        ...baseColumn,
                        valueGetter: (value: any) => {
                            if (!value) return null;
                            return new Date(value);
                        }
                    };
                }
                return baseColumn;
            });

            setColumns(formattedColumns);
            setRows(tableData.rows || []);
        } catch (error: any) {
            dispatch(
                setFeedback({
                    message: `Erro ao buscar logs do equipamento: ${error.message}`,
                    type: "error",
                })
            );
        } finally {
            setLoading(false);
        }
    }, [id, dispatch]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

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
            <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={40}
                sx={tableStyles}
                loading={loading}
                getRowId={(row) => row.id}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 50,
                        },
                    },
                }}
                checkboxSelection={false}
                pageSizeOptions={[25, 50, 100]}
                disableRowSelectionOnClick
                hideFooter={false}
                autoHeight={false}
                density="compact"
                disableColumnMenu={false}
                sortingMode="client"
                filterMode="client"
            />
        </Box>
    );
}
