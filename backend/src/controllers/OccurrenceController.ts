import { Request, Response } from 'express';
import { OccurrenceService } from '../services/occurrence/OccurrenceService';
import { AuthRequest } from '../middlewares/auth.middleware';

export class OccurrenceController {
  private occurrenceService = new OccurrenceService();

  async createOccurrence(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const occurrence = await this.occurrenceService.createOccurrence(req.body, userId);

      return res.status(201).json({
        success: true,
        data: occurrence,
        message: 'Ocorrência criada com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar ocorrência'
      });
    }
  }

  async getOccurrence(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const occurrence = await this.occurrenceService.getOccurrenceById(id);

      return res.status(200).json({
        success: true,
        data: occurrence
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Ocorrência não encontrada'
      });
    }
  }

  async listOccurrences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const {
        page = 1,
        limit = 20,
        type,
        status,
        municipality,
        startDate,
        endDate,
        search
      } = req.query;

      const filters = {
        page: Number(page),
        limit: Number(limit),
        type: type as string,
        status: status as string,
        municipality: municipality as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        search: search as string
      };

      const result = await this.occurrenceService.listOccurrences(filters, userId);

      return res.status(200).json({
        success: true,
        data: result.occurrences,
        pagination: {
          page: result.counts.total > 0 ? Number(page) : 0,
          limit: Number(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / Number(limit))
        },
        counts: result.counts
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar ocorrências'
      });
    }
  }

  async updateOccurrence(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const occurrence = await this.occurrenceService.updateOccurrence(id, req.body, userId);

      return res.status(200).json({
        success: true,
        data: occurrence,
        message: 'Ocorrência atualizada com sucesso'
      });
    } catch (error: any) {
      const status = error.message.includes('Permissão negada') ? 403 : 
                    error.message.includes('não encontrada') ? 404 : 400;
      
      return res.status(status).json({
        success: false,
        message: error.message || 'Erro ao atualizar ocorrência'
      });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
      }

      const occurrence = await this.occurrenceService.updateStatus(id, status, userId, reason);

      return res.status(200).json({
        success: true,
        data: occurrence,
        message: 'Status atualizado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar status'
      });
    }
  }

  async getStatistics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const {
        startDate,
        endDate,
        municipality
      } = req.query;

      const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        municipality: municipality as string
      };

      const stats = await this.occurrenceService.getStatistics(filters);

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
}