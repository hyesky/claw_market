import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { User } from '../models';

export class AuthController {
  // Register
  static async register(req: Request, res: Response): Promise<void> {
    const { email, password, phone, real_name } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    try {
      const user = await AuthService.register(email, password, phone, real_name);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            real_name: user.real_name,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Login with email
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    try {
      const { accessToken, refreshToken, user } = await AuthService.login(
        email,
        password
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            real_name: user.real_name,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Login with phone
  static async loginWithPhone(req: Request, res: Response): Promise<void> {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        success: false,
        message: 'Phone and password are required',
      });
      return;
    }

    try {
      const { accessToken, refreshToken, user } = await AuthService.loginWithPhone(
        phone,
        password
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            real_name: user.real_name,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout
  static async logout(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Token is required',
      });
      return;
    }

    try {
      await AuthService.logout(token);

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Third-party login (OAuth)
  static async thirdPartyLogin(req: Request, res: Response): Promise<void> {
    const { provider, providerId, email, name } = req.body;

    if (!provider || !providerId || !email) {
      res.status(400).json({
        success: false,
        message: 'Provider, providerId, and email are required',
      });
      return;
    }

    try {
      const { accessToken, refreshToken, user, isNewUser } =
        await AuthService.thirdPartyLogin(provider, providerId, email, name);

      res.json({
        success: true,
        message: isNewUser ? 'Registration successful' : 'Login successful',
        data: {
          accessToken,
          refreshToken,
          isNewUser,
          user: {
            id: user.id,
            email: user.email,
            real_name: user.real_name,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByPk(req.user!.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            real_name: user.real_name,
            role: user.role,
            openclaw_workspace_id: user.openclaw_workspace_id,
            status: user.status,
            created_at: user.created_at,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
