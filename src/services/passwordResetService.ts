import api from '../api';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

class PasswordResetService {
  async requestPasswordReset(data: ForgotPasswordRequest): Promise<void> {
    const response = await api.post('api/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await api.post('api/auth/reset-password', data);
    return response.data;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await api.get('api/auth/validate-reset-token', {
        params: { token },
      });
      return response.data.valid === true;
    } catch (error) {
      return false;
    }
  }
}

export default new PasswordResetService();

