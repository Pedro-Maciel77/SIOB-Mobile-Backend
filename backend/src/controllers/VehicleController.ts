import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle/VehicleService';
import { AuthRequest } from '../middlewares/auth.middleware';

export class VehicleController {
  private vehicleService = new VehicleService();

  async createVehicle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const vehicle = await this.vehicleService.createVehicle(req.body, userId);

      return res.status(201).json({
        success: true,
        data: vehicle,
        message: 'Viatura criada com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar viatura'
      });
    }
  }

  async getAllVehicles(req: AuthRequest, res: Response) {
    try {
      const { active } = req.query;
      const vehicles = await this.vehicleService.getAllVehicles(active === 'true');

      return res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar viaturas'
      });
    }
  }

  async getVehicleById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await this.vehicleService.getVehicleById(id);

      return res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Viatura não encontrada'
      });
    }
  }

  async updateVehicle(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const vehicle = await this.vehicleService.updateVehicle(id, req.body, userId);

      return res.status(200).json({
        success: true,
        data: vehicle,
        message: 'Viatura atualizada com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar viatura'
      });
    }
  }

  async deleteVehicle(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      await this.vehicleService.deleteVehicle(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Viatura deletada com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao deletar viatura'
      });
    }
  }

  async getVehicleStatistics(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const stats = await this.vehicleService.getVehicleStatistics(id);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Viatura não encontrada'
      });
    }
  }

  async toggleVehicleStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const vehicle = await this.vehicleService.toggleVehicleStatus(id, userId);

      return res.status(200).json({
        success: true,
        data: vehicle,
        message: `Viatura ${vehicle.active ? 'ativada' : 'desativada'} com sucesso`
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao alterar status da viatura'
      });
    }
  }
}