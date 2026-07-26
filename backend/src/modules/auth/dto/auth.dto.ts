import type { AuthenticatedUser } from '../types/auth.types';

export interface LoginRequestDto {
  username: string;
  password: string;
  deliveryMode?: 'cookie' | 'body';
}

export interface RefreshTokenRequestDto {
  refreshToken?: string;
  deliveryMode?: 'cookie' | 'body';
}

export interface LoginResponseDto {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  refreshToken?: string;
  user: AuthenticatedUser;
}

export type RefreshTokenResponseDto = LoginResponseDto;
