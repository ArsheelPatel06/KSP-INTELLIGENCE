import type { Request, Response } from 'express';
import { env } from '../../../config/env';
import { AppError } from '../../../core/exceptions/app-error';
import { ok } from '../../../core/response/api-response';
import type { LoginRequestDto, RefreshTokenRequestDto } from '../dto/auth.dto';
import type { AuthService } from '../services/auth.service';
import { setRefreshCookie, clearRefreshCookie } from '../utils/cookie';

import type { CatalystService } from '../services/catalyst.service';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly catalystService: CatalystService
  ) {}

  signup = async (req: Request, res: Response): Promise<Response> => {
    await this.authService.signup(req.body);
    return ok(res, { message: 'Account created successfully' }, 201);
  };

  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;
    await this.authService.forgotPassword(email);
    return ok(res, { message: 'If an account exists, a reset link has been sent.' });
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { token, password } = req.body;
    await this.authService.resetPassword(token, password);
    return ok(res, { message: 'Password has been reset successfully' });
  };

  catalystToken = async (req: Request, res: Response): Promise<Response> => {
    // Generate custom JWT using Catalyst SDK
    // @ts-ignore
    const user = req.user; // from authenticateMiddleware
    const tokenResponse = await this.catalystService.generateCustomToken(user);
    return ok(res, tokenResponse);
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const input = req.body as LoginRequestDto;
    const result = await this.authService.login(input, this.metadata(req));

    if (input.deliveryMode !== 'body') setRefreshCookie(res, result.tokens.refreshToken);

    return ok(res, {
      accessToken: result.tokens.accessToken,
      accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
      refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      ...(input.deliveryMode === 'body' ? { refreshToken: result.tokens.refreshToken } : {}),
      user: result.user,
    });
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    const input = req.body as RefreshTokenRequestDto;
    const cookieToken = req.cookies?.[env.AUTH_COOKIE_NAME] as string | undefined;
    const refreshToken = input.refreshToken ?? cookieToken;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', {
        statusCode: 401,
        code: 'REFRESH_TOKEN_REQUIRED',
      });
    }

    const result = await this.authService.refresh(refreshToken, this.metadata(req));
    if (input.deliveryMode !== 'body') setRefreshCookie(res, result.tokens.refreshToken);

    return ok(res, {
      accessToken: result.tokens.accessToken,
      accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
      refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      ...(input.deliveryMode === 'body' ? { refreshToken: result.tokens.refreshToken } : {}),
      user: result.user,
    });
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    // Optionally revoke the token in the DB here if needed
    clearRefreshCookie(res);
    return ok(res, { message: 'Logged out successfully' });
  };

  me = async (req: Request, res: Response): Promise<Response> => {
    // req.user is set by the authenticate middleware
    return ok(res, req.user);
  };

  private metadata(req: Request) {
    return {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      requestId: req.id ? String(req.id) : undefined,
    };
  }
}
