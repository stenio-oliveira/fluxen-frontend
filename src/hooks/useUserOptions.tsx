import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import UsuarioService from "../services/usuarioService";
import type { Option } from "../types/Option";
import type { UserFilters } from "../redux/slices/usersTableSlice";
import type { RootState } from "../redux/store";

export const useUserOptions = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);
    const [userOptions, setUserOptions] = useState<Option[]>([]);

    useEffect(() => {
      const fetchUserOptions = async () => {
        try {
            if (!user) return;
            
            const filters: UserFilters = {
                columnFilters: {
                    id: null,
                    nome: null,
                    email: null,
                    username: null
                },
                generalFilter: ""
            };
            
            const users = await UsuarioService.getUsuarios(user, filters);
            const options = users.map((usuario) => ({
                id: usuario.id,
                name: usuario.nome,
            }));
            console.log("userOptions", options);
            setUserOptions(options);
        } catch (e) {
          dispatch(
            setFeedback({
              message: `Erro ao buscar usuários: ${e}`,
              type: "error",
            })
          );
        }
      };

      fetchUserOptions(); 
    }, [user, dispatch]);

    return { userOptions };
};
