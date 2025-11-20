import { Box, Typography, Chip, Alert, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridPaginationModel } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import EquipamentoLogService from "../services/equipamentoLogService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { tableStyles } from "../styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import LogsCardView from "../components/logs/LogsCardView";
interface PaginationMeta {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

interface TableData {
    columns: GridColDef[];
    rows: any[];
    situation?: 'working' | 'frozen';
    metrics: any[];
    pagination?: PaginationMeta;
}

export default function EquipamentoLogGrupoTable() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
    const [situation, setSituation] = useState<'working' | 'frozen' | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [metrics, setMetrics] = useState<any[]>([]);

    // Paginação: 10 itens no mobile, 50 no desktop
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: isMobile ? 10 : 50
    });
    const [cardPage, setCardPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const paginationModelRef = useRef<GridPaginationModel>(paginationModel);

    useEffect(() => {
        paginationModelRef.current = paginationModel;
    }, [paginationModel]);

    // Componente para renderizar célula com alerta
    const MetricCell = (params: GridRenderCellParams) => {
        const { value, field, row } = params;
        const alertField = `${field}_alert`;

        const alert = row[alertField] as 'min' | 'max' | 'none';

        if (alert && alert !== 'none') {
            const isMaxAlert = alert === 'max';
            const message = isMaxAlert ? 'Valor muito próximo ou igual ao máximo permitido' : 'Valor muito próximo ou igual ao mínimo permitido';

            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'end' }}>
                    <Tooltip title={message}>
                        <WarningIcon
                            sx={{
                                fontSize: 16,
                                color: isMaxAlert ? 'error.main' : 'error.main'
                            }}
                        />
                    </Tooltip>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isMaxAlert ? 'error.main' : 'warning.main',
                            fontWeight: 'bold'
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            );
        }

        return <Typography variant="body2">{value}</Typography>;
    };


    const fetchTableData = useCallback(async (model?: GridPaginationModel, isAutoRefresh = false) => {
        if (!id) return;

        const currentPagination = model ?? paginationModelRef.current;

        if (isAutoRefresh) {
            setIsAutoRefreshing(true);
        } else {
            setLoading(true);
        }
        try {
            const tableData: TableData = await EquipamentoLogService.getLogsTableData(Number(id), {
                page: currentPagination.page + 1,
                pageSize: currentPagination.pageSize
            });
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

                // Add custom renderCell for metric columns to show alerts
                if (col.field?.startsWith('metrica_')) {
                    return {
                        ...baseColumn,
                        renderCell: MetricCell
                    };
                }

                return baseColumn;
            });

            setColumns(formattedColumns);
            setRows(tableData.rows || []);
            setSituation(tableData.situation ?? null);
            setMetrics(tableData.metrics || []);
            setRowCount(tableData.pagination?.totalItems ?? tableData.rows?.length ?? 0);

            if (tableData.pagination) {
                setTotalPages(tableData.pagination.totalPages);
                const serverModel: GridPaginationModel = {
                    page: Math.max(tableData.pagination.page - 1, 0),
                    pageSize: tableData.pagination.pageSize
                };

                if (
                    serverModel.page !== paginationModel.page ||
                    serverModel.pageSize !== paginationModel.pageSize
                ) {
                    setPaginationModel(serverModel);
                    setCardPage(tableData.pagination.page);
                }
            }
        } catch (error: any) {
            dispatch(
                setFeedback({
                    message: `Erro ao buscar logs do equipamento: ${error.message}`,
                    type: "error",
                })
            );
        } finally {
            if (isAutoRefresh) {
                setIsAutoRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    }, [id, dispatch]);

    // Ajustar pageSize quando mudar de mobile para desktop ou vice-versa
    useEffect(() => {
        const newPageSize = isMobile ? 10 : 50;
        if (paginationModel.pageSize !== newPageSize) {
            const newModel: GridPaginationModel = {
                page: 0,
                pageSize: newPageSize
            };
            setPaginationModel(newModel);
            setCardPage(1);
            // Recarregar dados com novo pageSize
            fetchTableData(newModel);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    useEffect(() => {
        // Fetch inicial
        fetchTableData();

        // Configurar fetch automático a cada 10 segundos
        const interval = setInterval(() => {
            fetchTableData(undefined, true); // true indica que é um refresh automático
        }, 10000); // 10 segundos

        // Cleanup: limpar o interval quando o componente for desmontado
        return () => {
            clearInterval(interval);
        };
    }, [fetchTableData]);

    // Handler para mudança de página nos cards
    const handleCardPageChange = useCallback((newPage: number) => {
        setCardPage(newPage);
        const newPaginationModel: GridPaginationModel = {
            page: newPage - 1,
            pageSize: paginationModel.pageSize
        };
        setPaginationModel(newPaginationModel);
        fetchTableData(newPaginationModel);
    }, [paginationModel.pageSize]);

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
            {/* Alerta de situação "frozen" */}
            {situation === 'frozen' && (
                <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{
                        mb: 1,
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        '& .MuiAlert-message': {
                            fontSize: isMobile ? '0.875rem' : '1rem',
                        }
                    }}
                >
                    Equipamento sem variação nas últimas 5 leituras. Verifique possíveis falhas de leitura.
                </Alert>
            )}

            {/* Indicador de atualização automática */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                }}
            >
                <Chip
                    icon={<AccessTimeIcon />}
                    label={isMobile ? "Auto: 10s" : "Atualização automática a cada 10s"}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    color="primary"
                    sx={{
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                    }}
                />
                {isAutoRefreshing && (
                    <Typography
                        variant="caption"
                        color="primary"
                        sx={{
                            fontStyle: "italic",
                            fontSize: isMobile ? '0.7rem' : '0.75rem',
                        }}
                    >
                        Atualizando...
                    </Typography>
                )}
            </Box>

            {/* Renderização condicional: Cards no mobile, Tabela no desktop */}
            {isMobile ? (
                <LogsCardView
                    rows={rows}
                    columns={columns}
                    metrics={metrics}
                    loading={loading}
                    page={cardPage}
                    totalPages={totalPages}
                    onPageChange={handleCardPageChange}
                />
            ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowHeight={40}
                        sx={tableStyles}
                        loading={loading}
                        getRowId={(row) => row.id}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => {
                            setPaginationModel(model);
                            fetchTableData(model);
                        }}
                        rowCount={rowCount}
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
            )}
        </Box>
    );
}
