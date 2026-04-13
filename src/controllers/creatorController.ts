import { Request, Response } from 'express';
import { CreatorVerificationService } from '../services/CreatorVerificationService';

export class CreatorController {
  // Verify identity
  static async verifyIdentity(req: Request, res: Response): Promise<void> {
    try {
      const { real_name, id_card, phone } = req.body;

      const result = await CreatorVerificationService.verifyIdentity(
        req.user!.id,
        real_name,
        id_card,
        phone
      );

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Bind workspace
  static async bindWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { workspace_id } = req.body;

      const result = await CreatorVerificationService.bindWorkspace(
        req.user!.id,
        workspace_id
      );

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Verify workspace
  static async verifyWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { workspace_id } = req.body;

      const result = await CreatorVerificationService.verifyWorkspace(
        req.user!.id,
        workspace_id
      );

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Upgrade to creator
  static async upgradeToCreator(req: Request, res: Response): Promise<void> {
    try {
      const user = await CreatorVerificationService.upgradeToCreator(req.user!.id);

      res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get verification status
  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await CreatorVerificationService.getVerificationStatus(req.user!.id);

      res.json({
        success: true,
        data: { status },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Unbind workspace
  static async unbindWorkspace(req: Request, res: Response): Promise<void> {
    try {
      await CreatorVerificationService.unbindWorkspace(req.user!.id);

      res.json({
        success: true,
        message: 'Workspace unbound successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
