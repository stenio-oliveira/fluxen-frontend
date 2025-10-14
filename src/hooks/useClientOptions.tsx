import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import UsuarioService from "../services/usuarioService";
import type { Option } from "../types/Option";

export const useClientOptions = () => {
    const dispatch = useDispatch();
    const [clientOptions, setClientOptions] = useState<Option[]>([]);

    useEffect(() => {
      const fetchClientOptions = async () => {
        try {
            const clients = await UsuarioService.getClientUsers();
            const options = clients.map((client) => ({
                id: client.id,
                name: client.nome,
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
    }, []);

    return {clientOptions};
    // return [
    //     { value: '1', label: 'Cliente 1' },
    //     { value: '2', label: 'Cliente 2' },
    //     { value: '3', label: 'Cliente 3' },
    // ];
};