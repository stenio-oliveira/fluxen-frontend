import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import ClienteService from "../services/clienteService";
import type { Option } from "../types/Option";
import type { RootState } from "../redux/store";
import type { ClienteFilters } from "../redux/slices/clientesTableSlice";

export const useClientOptions = () => {
    const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
    const [clientOptions, setClientOptions] = useState<Option[]>([]);

    useEffect(() => {
      const fetchClientOptions = async () => {
        if (!user) return;

        try {
          // Criar filtros vazios para buscar todos os clientes
          const filters: ClienteFilters = {
            columnFilters: {
              id: null,
              nome: null,
              cnpj: null,
              responsavel_nome: null,
            },
            generalFilter: "",
          };

          const clients = await ClienteService.getClientes(user, filters);
            const options = clients.map((client) => ({
                id: client.id,
              name: client.nome || `Cliente ${client.id}`,
            }));

            console.log("clientOptions", options);
            setClientOptions(options);
        } catch (e) {
          dispatch(
            setFeedback({
              message: `Erro ao buscar clientes: ${e}`,
              type: "error",
            })
          );
        }
      };

      fetchClientOptions(); 
    }, [user, dispatch]);

  return { clientOptions };
};
