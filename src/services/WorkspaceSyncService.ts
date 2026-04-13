import { User, Order, SoulProduct, SoulVersion } from '../models';
import AuditLog from '../models/AuditLog';

interface SyncResult {
  success: boolean;
  message?: string;
  filesUploaded?: string[];
  errorMessage?: string;
}

export class WorkspaceSyncService {
  private static RETRY_COUNT = 3;
  private static RETRY_DELAY = 1000; // 1 second

  // Upload config to OpenClaw workspace
  static async uploadToWorkspace(
    order_id: string,
    user_id: string,
    product_id: string,
    version_id?: string
  ): Promise<SyncResult> {
    const order = await Order.findByPk(order_id);
    if (!order) {
      return { success: false, errorMessage: 'Order not found' };
    }

    const user = await User.findByPk(user_id);
    if (!user || !user.openclaw_workspace_id) {
      return { success: false, errorMessage: 'No workspace bound to this account' };
    }

    // Verify order belongs to user
    if (order.buyer_id !== user_id) {
      return { success: false, errorMessage: 'Order does not belong to this user' };
    }

    const product = await SoulProduct.findByPk(product_id);
    if (!product) {
      return { success: false, errorMessage: 'Product not found' };
    }

    // Get version content
    let version: SoulVersion | null = null;
    if (version_id) {
      version = await SoulVersion.findByPk(version_id);
    }

    if (!version) {
      version = await SoulVersion.findOne({
        where: { product_id, is_latest: true },
      });
    }

    if (!version) {
      return { success: false, errorMessage: 'Version not found' };
    }

    // Simulate upload to OpenClaw API
    // In production, this would make HTTP requests to OpenClaw API
    const uploadResult = await this.simulateOpenClawUpload(
      user.openclaw_workspace_id,
      version.file_content,
      product.slug
    );

    if (!uploadResult.success) {
      return uploadResult;
    }

    // Log action
    await AuditLog.create({
      action: 'workspace_sync',
      user_id,
      target_type: 'order',
      target_id: order_id,
      details: {
        order_id,
        product_id,
        version_id: version.id,
        workspace_id: user.openclaw_workspace_id,
        synced_at: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: 'Configuration synced successfully',
      filesUploaded: uploadResult.filesUploaded || ['SOUL.md'],
    };
  }

  // Verify sync status
  static async verifySync(
    workspace_id: string,
    product_slug: string
  ): Promise<{ synced: boolean; lastSyncedAt?: Date }> {
    // In production, this would query OpenClaw API to check if config exists
    // For now, return a simulated response
    const exists = await this.simulateOpenClawConfigExists(workspace_id, product_slug);

    if (!exists) {
      return { synced: false };
    }

    return {
      synced: true,
      lastSyncedAt: new Date(),
    };
  }

  // Sync multiple configs (bundle)
  static async syncBundle(
    order_id: string,
    user_id: string,
    product_id: string,
    files: Array<{ fileName: string; content: string }>
  ): Promise<SyncResult> {
    const order = await Order.findByPk(order_id);
    if (!order) {
      return { success: false, errorMessage: 'Order not found' };
    }

    const user = await User.findByPk(user_id);
    if (!user || !user.openclaw_workspace_id) {
      return { success: false, errorMessage: 'No workspace bound to this account' };
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const result = await this.simulateOpenClawUpload(
        user.openclaw_workspace_id,
        file.content,
        file.fileName
      );

      if (!result.success) {
        return {
          success: false,
          errorMessage: `Failed to upload ${file.fileName}: ${result.errorMessage}`,
          filesUploaded: uploadedFiles,
        };
      }

      uploadedFiles.push(file.fileName);
    }

    // Log action
    await AuditLog.create({
      action: 'workspace_sync_bundle',
      user_id,
      target_type: 'order',
      target_id: order_id,
      details: {
        order_id,
        product_id,
        files: uploadedFiles,
        workspace_id: user.openclaw_workspace_id,
        synced_at: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Bundle synced successfully (${uploadedFiles.length} files)`,
      filesUploaded: uploadedFiles,
    };
  }

  // Simulate upload to OpenClaw API (placeholder)
  private static async simulateOpenClawUpload(
    workspaceId: string,
    content: string,
    fileName: string
  ): Promise<SyncResult> {
    // Simulate API call with retry logic
    for (let i = 0; i < this.RETRY_COUNT; i++) {
      try {
        // In production, this would be:
        // const response = await fetch(`https://api.openclaw.ai/workspaces/${workspaceId}/configs`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ fileName, content }),
        // });
        //
        // if (!response.ok) {
        //   throw new Error(`HTTP ${response.status}`);
        // }

        // Simulate successful upload
        await new Promise((resolve) => setTimeout(resolve, 100));

        return {
          success: true,
          message: `Uploaded ${fileName} successfully`,
          filesUploaded: [fileName],
        };
      } catch (error: any) {
        if (i === this.RETRY_COUNT - 1) {
          return {
            success: false,
            errorMessage: `Failed to upload ${fileName} after ${this.RETRY_COUNT} attempts: ${error.message}`,
          };
        }
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
      }
    }

    return {
      success: false,
      errorMessage: `Failed to upload ${fileName}: Unknown error`,
    };
  }

  // Simulate check if config exists in OpenClaw
  private static async simulateOpenClawConfigExists(
    workspaceId: string,
    productSlug: string
  ): Promise<boolean> {
    // In production, this would be:
    // const response = await fetch(`https://api.openclaw.ai/workspaces/${workspaceId}/configs/${productSlug}`);
    // return response.ok;

    // Simulate existence check
    return true;
  }

  // Get user's synced configs
  static async getUserSyncs(
    user_id: string,
    page = 1,
    limit = 20
  ): Promise<{
    syncs: Array<{
      order_id: string;
      product_title: string;
      synced_at: Date;
    }>;
    total: number;
  }> {
    // Get user's orders that have been synced
    const orders = await Order.findAll({
      where: {
        buyer_id: user_id,
        payment_status: 'paid',
      },
      include: [
        {
          model: SoulProduct,
          as: 'product',
          attributes: ['title', 'slug'],
        },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    });

    const total = await Order.count({
      where: {
        buyer_id: user_id,
        payment_status: 'paid',
      },
    });

    return {
      syncs: orders.map((order) => ({
        order_id: order.id,
        product_title: (order.product as any)?.title || 'Unknown',
        synced_at: order.created_at,
      })),
      total,
    };
  }
}
