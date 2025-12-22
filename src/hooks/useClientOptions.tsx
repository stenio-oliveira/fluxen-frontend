import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import ClienteService from "../services/clienteService";
import type { Option } from "../types/Option";
import type { RootState } from "../redux/store";
import type { ClienteFilters } from "../redux/slices/clientesTableSlice";
import type { Cliente } from "../types/Cliente";

export const useClientOptions = () => {
    const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
    const [clientOptions, setClientOptions] = useState<Option[]>([]);

    useEffect(() => {
      const fetchClientOptions = async () => {
        if (!user) {
          console.log("useClientOptions: user não encontrado");
          return;
        }

        try {
          console.log("useClientOptions: user", user);
          console.log("useClientOptions: user.is_gestor", user.is_gestor);
          
          // Criar filtros vazios para buscar todos os clientes
          const filters: ClienteFilters = {
            columnFilters: {
              id: null,
              nome: null,
              cnpj: null,
            },
            generalFilter: "",
          };

          // Se o usuário for gestor, buscar apenas os clientes em que ele é gestor
          // Também tenta buscar por gestor se is_gestor não estiver definido mas o usuário for gestor
          let clients: Cliente[];
          if (user.is_gestor === true) {
            console.log("useClientOptions: user é gestor (is_gestor=true), buscando clientes por gestor");
            clients = await ClienteService.getClientesByManager(user.id, filters);
            console.log("useClientOptions: clientes retornados (gestor)", clients);
          } else {
            console.log("useClientOptions: user não é gestor ou is_gestor não definido, buscando clientes normais");
            // O método getClientes já verifica se é gestor e retorna os clientes corretos
            clients = await ClienteService.getClientes(user, filters);
            console.log("useClientOptions: clientes retornados (normal)", clients);
          }

          if (!clients || !Array.isArray(clients)) {
            console.error("useClientOptions: clients não é um array", clients);
            setClientOptions([]);
            return;
          }

          const options = clients.map((client) => ({
            id: client.id,
            name: client.nome || `Cliente ${client.id}`,
          }));

          console.log("useClientOptions: clientOptions finais", options);
          setClientOptions(options);
        } catch (e) {
          console.error("useClientOptions: erro ao buscar clientes", e);
          dispatch(
            setFeedback({
              message: `Erro ao buscar clientes: ${e}`,
              type: "error",
            })
          );
          setClientOptions([]);
        }
      };

      fetchClientOptions(); 
    }, [user, dispatch]);

  return { clientOptions };
};
