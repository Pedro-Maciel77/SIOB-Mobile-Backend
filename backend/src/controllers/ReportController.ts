import { Request, Response } from 'express';
import { ReportService } from '../services/report/ReportService';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ReportController {
  private reportService = new ReportService();

  async createReport(req: AuthRequest, res: Response) {
    try {
      const { occurrenceId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const report = await this.reportService.createReport(occurrenceId, req.body, userId);

      return res.status(201).json({
        success: true,
        data: report,
        message: 'Relatório criado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar relatório'
      });
    }
  }

  async getReportById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const report = await this.reportService.getReportById(id);

      return res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Relatório não encontrado'
      });
    }
  }

  async getOccurrenceReports(req: AuthRequest, res: Response) {
    try {
      const { occurrenceId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const filters = {
        page: Number(page),
        limit: Number(limit),
        occurrenceId
      };

      const result = await this.reportService.getOccurrenceReports(filters);

      return res.status(200).json({
        success: true,
        data: result.reports,
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
        message: error.message || 'Erro ao listar relatórios'
      });
    }
  }

  async updateReport(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const report = await this.reportService.updateReport(id, req.body, userId);

      return res.status(200).json({
        success: true,
        data: report,
        message: 'Relatório atualizado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar relatório'
      });
    }
  }

  async deleteReport(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      await this.reportService.deleteReport(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Relatório deletado com sucesso'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao deletar relatório'
      });
    }
  }

  async addImageToReport(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const file = req.file;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhuma imagem enviada'
        });
      }

      const report = await this.reportService.addImage(id, file, userId);

      return res.status(200).json({
        success: true,
        data: report,
        message: 'Imagem adicionada ao relatório'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao adicionar imagem'
      });
    }
  }
}