import { Op } from 'sequelize';
import { ContentModeration, SoulProduct, User } from '../models';
import AuditLog from '../models/AuditLog';

export class ModerationService {
  // Flag content for review
  static async flagContent(
    product_id: string,
    reason: string,
    reporter_id?: string
  ): Promise<ContentModeration> {
    // Verify product exists
    const product = await SoulProduct.findByPk(product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Create moderation record
    const moderation = await ContentModeration.create({
      product_id,
      status: 'flagged',
      reason,
      moderator_id: reporter_id || undefined,
    });

    // Log action
    await AuditLog.create({
      action: 'content_flagged',
      user_id: reporter_id,
      target_type: 'product',
      target_id: product_id,
      details: { reason, moderation_id: moderation.id },
    });

    return moderation;
  }

  // Approve content
  static async approveContent(
    moderation_id: string,
    moderator_id: string
  ): Promise<ContentModeration> {
    const moderation = await ContentModeration.findByPk(moderation_id);
    if (!moderation) {
      throw new Error('Moderation record not found');
    }

    // Verify moderator is admin
    const moderator = await User.findByPk(moderator_id);
    if (!moderator || moderator.role !== 'admin') {
      throw new Error('Admin role required');
    }

    moderation.status = 'approved';
    moderation.moderator_id = moderator_id;
    await moderation.save();

    // Update product status if approved
    if (moderation.product_id) {
      await SoulProduct.update(
        { status: 'published' },
        { where: { id: moderation.product_id } }
      );
    }

    // Log action
    await AuditLog.create({
      action: 'content_approved',
      user_id: moderator_id,
      target_type: 'moderation',
      target_id: moderation_id,
      details: { product_id: moderation.product_id },
    });

    return moderation;
  }

  // Reject content
  static async rejectContent(
    moderation_id: string,
    moderator_id: string,
    reason: string
  ): Promise<ContentModeration> {
    const moderation = await ContentModeration.findByPk(moderation_id);
    if (!moderation) {
      throw new Error('Moderation record not found');
    }

    // Verify moderator is admin
    const moderator = await User.findByPk(moderator_id);
    if (!moderator || moderator.role !== 'admin') {
      throw new Error('Admin role required');
    }

    moderation.status = 'rejected';
    moderation.reason = reason;
    moderation.moderator_id = moderator_id;
    await moderation.save();

    // Update product status if rejected
    if (moderation.product_id) {
      await SoulProduct.update(
        { status: 'rejected' },
        { where: { id: moderation.product_id } }
      );
    }

    // Log action
    await AuditLog.create({
      action: 'content_rejected',
      user_id: moderator_id,
      target_type: 'moderation',
      target_id: moderation_id,
      details: { reason, product_id: moderation.product_id },
    });

    return moderation;
  }

  // Get moderation queue
  static async getModerationQueue(
    page = 1,
    limit = 20
  ): Promise<{ moderations: ContentModeration[]; total: number }> {
    const { count, rows } = await ContentModeration.findAndCountAll({
      where: {
        status: { [Op.in]: ['pending', 'flagged'] },
      },
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: SoulProduct,
          as: 'product',
          attributes: ['id', 'title', 'slug', 'status'],
        },
        {
          model: User,
          as: 'moderator',
          attributes: ['id', 'real_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return { moderations: rows, total: count };
  }

  // Get moderation history
  static async getModerationHistory(
    product_id: string
  ): Promise<ContentModeration[]> {
    return ContentModeration.findAll({
      where: { product_id },
      include: [
        {
          model: User,
          as: 'moderator',
          attributes: ['id', 'real_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // Scan file for prompt injection
  static async scanForPromptInjection(
    content: string,
    product_id: string
  ): Promise<{
    isSafe: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    issues: string[];
  }> {
    const issues: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for common prompt injection patterns
    const injectionPatterns = [
      /ignore\s*previous\s*instructions/i,
      /do\s*not\s*follow/i,
      /system\s*prompt/i,
      /admin\s*access/i,
      /bypass\s*security/i,
      /extract\s*data/i,
      /dump\s*database/i,
      /sql\s*injection/i,
      /<script>/i,
      /javascript:/i,
    ];

    injectionPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        issues.push(`Detected pattern: ${pattern.toString()}`);
        riskLevel = 'high';
      }
    });

    // Check for suspicious instructions
    const suspiciousPatterns = [
      /execute\s*command/i,
      /run\s*script/i,
      /access\s*file/i,
      /read\s*file/i,
      /write\s*file/i,
    ];

    suspiciousPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        issues.push(`Suspicious instruction detected: ${pattern.toString()}`);
        if (riskLevel !== 'high') riskLevel = 'medium';
      }
    });

    return {
      isSafe: issues.length === 0,
      riskLevel,
      issues,
    };
  }

  // Auto-moderate content
  static async autoModerate(
    product_id: string,
    version_id: string,
    content: string
  ): Promise<ContentModeration> {
    // Scan for prompt injection
    const scanResult = await this.scanForPromptInjection(content, product_id);

    // Create moderation record
    const moderation = await ContentModeration.create({
      product_id,
      version_id,
      status: scanResult.isSafe ? 'approved' : 'flagged',
      reason: scanResult.issues.join(', '),
    });

    // Log action
    await AuditLog.create({
      action: 'auto_moderation',
      target_type: 'product',
      target_id: product_id,
      details: scanResult,
    });

    return moderation;
  }
}
