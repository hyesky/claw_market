import { Request, Response } from 'express';
import { WorkspaceSyncService } from '../services/WorkspaceSyncService';

export class WorkspaceSyncController {
  // Sync config to workspace
  static async syncToWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { order_id, product_id, version_id } = req.body;

      const result = await WorkspaceSyncService.uploadToWorkspace(
        order_id,
        req.user!.id,
        product_id,
        version_id
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.errorMessage,
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Verify sync status
  static async verifySync(req: Request, res: Response): Promise<void> {
    try {
      const { workspace_id, product_slug } = req.query;

      const result = await WorkspaceSyncService.verifySync(
        workspace_id as string,
        product_slug as string
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Sync bundle
  static async syncBundle(req: Request, res: Response): Promise<void> {
    try {
      const { order_id, product_id, files } = req.body;

      const result = await WorkspaceSyncService.syncBundle(
        order_id,
        req.user!.id,
        product_id,
        files
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.errorMessage,
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user's synced configs
  static async getUserSyncs(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;

      const { syncs, total } = await WorkspaceSyncService.getUserSyncs(
        req.user!.id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );

      res.json({
        success: true,
        data: {
          syncs,
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
}
