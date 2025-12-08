import { Request, Response } from 'express';
import { AuthService } from '../services/auth/AuthService';
import { AuthRequest } from '../middlewares/auth.middleware';
import { LoginDTO } from '../dtos/auth/LoginDTO';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import { AuthResponseDTO } from '../dtos/auth/AuthResponseDTO';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const result = await this.authService.login(email, password);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Erro ao fazer login'
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, registration, unit } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      const result = await this.authService.register({
        name,
        email,
        password,
        role: role || 'user',
        registration,
        unit
      });

      return res.status(201).json({
        success: true,
        data: result,
        message: 'Usuário registrado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao registrar usuário'
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token é obrigatório'
        });
      }

      const result = await this.authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Erro ao renovar token'
      });
    }
  }

  async logout(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const ip = req.ip || '127.0.0.1';

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      await this.authService.logout(userId, ip);

      return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer logout'
      });
    }
  }

  async profile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter perfil'
      });
    }
  }
}