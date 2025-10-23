import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import UsuarioPerfilService from "../services/usuarioPerfilService";
import type { Option } from "../types/Option";
import type { Perfil } from "../types/Perfil";

export const useUserProfileOptions = () => {
    const dispatch = useDispatch();
    const [profileOptions, setProfileOptions] = useState<Option[]>([]);

    useEffect(() => {
      const fetchProfileOptions = async () => {
        try {
            // O endpoint usuario-perfis retorna os perfis diretamente
            const perfis = await UsuarioPerfilService.getUsuarioPerfis() as Perfil[];
            
            // Converter perfis para formato Option
            const options = perfis.map((perfil) => ({
                id: perfil.id,
                name: perfil.nome,
            }));

            console.log("profileOptions", options);
            setProfileOptions(options);
        } catch (e) {
          dispatch(
            setFeedback({
              message: `Erro ao buscar perfis: ${e}`,
              type: "error",
            })
          );
        }
      };

      fetchProfileOptions(); 
    }, [dispatch]);

    return { profileOptions };
};
