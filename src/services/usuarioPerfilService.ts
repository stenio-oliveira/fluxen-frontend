import api from '../api';

class UsuarioPerfilService {
  static endpoint = '/usuario-perfis';

  static getUsuarioPerfis() {
    return api.get(this.endpoint);
  }

  static getUsuarioPerfilById(id: number) {
    return api.get(`${this.endpoint}/${id}`);
  }

  static createUsuarioPerfil(data: any) {
    return api.post(this.endpoint, data);
  }

  static updateUsuarioPerfil(id: number, data: any) {
    return api.put(`${this.endpoint}/${id}`, data);
  }

  static deleteUsuarioPerfil(id: number) {
    return api.delete(`${this.endpoint}/${id}`);
  }
}

export default UsuarioPerfilService;
