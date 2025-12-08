import { Request, Response } from 'express';
import { UserService } from '../services/user/UserService';
import { AuthRequest } from '../middlewares/auth.middleware';

export class UserController {
  private userService = new UserService();

  async createUser(req: AuthRequest, res: Response) {
    try {
      const currentUser = req.user;
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor')) {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const user = await this.userService.createUser(req.body);

      return res.status(201).json({
        success: true,
        data: user,
        message: 'Usuário criado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar usuário'
      });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const currentUser = req.user;
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor')) {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const { page = 1, limit = 20, search, role, unit } = req.query;
      
      const filters = {
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        role: role as string,
        unit: unit as string
      };

      const result = await this.userService.getAllUsers(filters);

      return res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / Number(limit))
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar usuários'
      });
    }
  }

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      // Usuário pode ver seu próprio perfil ou admin/supervisor pode ver qualquer
      if (currentUser.id !== id && currentUser.role !== 'admin' && currentUser.role !== 'supervisor') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const user = await this.userService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Usuário não encontrado'
      });
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      // Apenas admin/supervisor ou o próprio usuário pode atualizar
      if (currentUser.id !== id && currentUser.role !== 'admin' && currentUser.role !== 'supervisor') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      // Não permitir que não-admin altere role
      if (req.body.role && currentUser.role !== 'admin') {
        delete req.body.role;
      }

      const user = await this.userService.updateUser(id, req.body, currentUser.id);

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar usuário'
      });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem deletar usuários'
        });
      }

      // Não permitir deletar a si mesmo
      if (currentUser.id === id) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível deletar seu próprio usuário'
        });
      }

      await this.userService.deleteUser(id, currentUser.id);

      return res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao deletar usuário'
      });
    }
  }

  async getStatistics(req: AuthRequest, res: Response) {
    try {
      const currentUser = req.user;
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor')) {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const stats = await this.userService.getStatistics();

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter estatísticas'
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      // Não permitir alterar role pelo perfil
      if (req.body.role) {
        delete req.body.role;
      }

      const user = await this.userService.updateUser(userId, req.body, userId);

      return res.status(200).json({
        success: true,
        data: user,
        message: 'Perfil atualizado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar perfil'
      });
    }
  }
}