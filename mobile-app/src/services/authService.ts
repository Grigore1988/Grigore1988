import {apiClient} from './apiClient';
import {User, AuthTokens, LoginRequest, RegisterRequest} from '@tradepro/shared';

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

interface RefreshTokenResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }
    
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Token refresh failed');
    }
    
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {refreshToken});
    } catch (error) {
      // Don't throw error on logout failure
      console.error('Logout error:', error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post('/auth/forgot-password', {email});
    
    if (!response.success) {
      throw new Error(response.error || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Password reset failed');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post('/auth/verify-email', {token});
    
    if (!response.success) {
      throw new Error(response.error || 'Email verification failed');
    }
  }

  async enable2FA(): Promise<{qrCode: string; secret: string}> {
    const response = await apiClient.post<{qrCode: string; secret: string}>('/auth/2fa/enable');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to enable 2FA');
    }
    
    return response.data;
  }

  async verify2FA(code: string): Promise<void> {
    const response = await apiClient.post('/auth/2fa/verify', {code});
    
    if (!response.success) {
      throw new Error(response.error || '2FA verification failed');
    }
  }

  async disable2FA(code: string): Promise<void> {
    const response = await apiClient.post('/auth/2fa/disable', {code});
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to disable 2FA');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Password change failed');
    }
  }
}

export const authService = new AuthService();