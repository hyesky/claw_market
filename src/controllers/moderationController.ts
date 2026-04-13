import { Request, Response } from 'express';
import { ModerationService } from '../services/ModerationService';

export class ModerationController {
  // Flag content
  static async flagContent(req: Request, res: Response): Promise<void> {
    try {
      const { product_id } = req.params;
      const { reason } = req.body;

      const moderation = await ModerationService.flagContent(
        product_id,
        reason,
        req.user!.id
      );

      res.status(201).json({
        success: true,
        data: { moderation },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get moderation queue (admin only)
  static async getQueue(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;

      const { moderations, total } = await ModerationService.getModerationQueue(
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );

      res.json({
        success: true,
        data: {
          moderations,
          total,
          page: parseInt(page as string) || 1,
          limit: parseInt(limit as string) || 20,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Approve content (admin only)
  static async approve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const moderation = await ModerationService.approveContent(id, req.user!.id);

      res.json({
        success: true,
        data: { moderation },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Reject content (admin only)
  static async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const moderation = await ModerationService.rejectContent(id, req.user!.id, reason);

      res.json({
        success: true,
        data: { moderation },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get moderation history
  static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { product_id } = req.params;

      const history = await ModerationService.getModerationHistory(product_id);

      res.json({
        success: true,
        data: { history },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Scan content for prompt injection
  static async scan(req: Request, res: Response): Promise<void> {
    try {
      const { content, product_id } = req.body;

      const result = await ModerationService.scanForPromptInjection(content, product_id);

      res.json({
        success: true,
        data: { result },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Auto-moderate content
  static async autoModerate(req: Request, res: Response): Promise<void> {
    try {
      const { product_id, version_id, content } = req.body;

      const moderation = await ModerationService.autoModerate(product_id, version_id, content);

      res.status(201).json({
        success: true,
        data: { moderation },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
