import api from "../api";
import type { Usuario } from "../types/Usuario";

class AuthService {
  static endpoint = 'api/auth';

  static register(data: Partial<Usuario>): Promise<void> {
    return api.post(`${this.endpoint}/register`, data);
  }

  static async login(data: { email: string; password: string }): Promise<{ token: string, user: Usuario}> {
    const response = await api.post(`${this.endpoint}/login`, data);
    return response.data;
  }
}

export default AuthService;
