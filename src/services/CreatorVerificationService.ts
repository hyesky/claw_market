import { User } from '../models';
import AuditLog from '../models/AuditLog';

export class CreatorVerificationService {
  // Verify creator identity
  static async verifyIdentity(
    user_id: string,
    real_name: string,
    id_card?: string,
    phone?: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Basic validation
    if (!real_name || real_name.trim().length < 2) {
      return { success: false, message: 'Real name is required and must be at least 2 characters' };
    }

    // Update user
    await user.update({
      real_name: real_name.trim(),
      phone: phone || user.phone,
    });

    // Log action
    await AuditLog.create({
      action: 'identity_verification',
      user_id,
      target_type: 'user',
      target_id: user_id,
      details: { real_name, verified_at: new Date().toISOString() },
    });

    return { success: true, message: 'Identity verified successfully' };
  }

  // Bind OpenClaw workspace
  static async bindWorkspace(
    user_id: string,
    workspace_id: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate workspace ID format
    if (!this.validateWorkspaceId(workspace_id)) {
      return { success: false, message: 'Invalid workspace ID format' };
    }

    // Check if workspace already bound to another user
    const existingBinding = await User.findOne({
      where: { openclaw_workspace_id: workspace_id },
    });

    if (existingBinding && existingBinding.id !== user_id) {
      return { success: false, message: 'Workspace already bound to another account' };
    }

    // Bind workspace
    await user.update({ openclaw_workspace_id: workspace_id });

    // Log action
    await AuditLog.create({
      action: 'workspace_bound',
      user_id,
      target_type: 'user',
      target_id: user_id,
      details: { workspace_id, bound_at: new Date().toISOString() },
    });

    return { success: true, message: 'Workspace bound successfully' };
  }

  // Verify workspace ownership
  static async verifyWorkspace(
    user_id: string,
    workspace_id: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.openclaw_workspace_id) {
      return { success: false, message: 'No workspace bound to this account' };
    }

    if (user.openclaw_workspace_id !== workspace_id) {
      return { success: false, message: 'Workspace ID does not match bound workspace' };
    }

    return { success: true, message: 'Workspace verified' };
  }

  // Upgrade to creator role
  static async upgradeToCreator(user_id: string): Promise<User> {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check verification requirements
    if (!user.real_name) {
      throw new Error('Real name verification required');
    }

    if (!user.openclaw_workspace_id) {
      throw new Error('OpenClaw workspace binding required');
    }

    // Upgrade role
    await user.update({ role: 'creator' });

    // Log action
    await AuditLog.create({
      action: 'role_upgraded',
      user_id,
      target_type: 'user',
      target_id: user_id,
      details: { from: user.role, to: 'creator' },
    });

    return user;
  }

  // Check if user is verified creator
  static async isVerifiedCreator(user_id: string): Promise<boolean> {
    const user = await User.findByPk(user_id);
    if (!user) {
      return false;
    }

    return (
      user.role === 'creator' &&
      !!user.real_name &&
      !!user.openclaw_workspace_id &&
      user.status === 'active'
    );
  }

  // Get verification status
  static async getVerificationStatus(user_id: string): Promise<{
    isVerified: boolean;
    hasRealName: boolean;
    hasWorkspace: boolean;
    isCreator: boolean;
    missingRequirements: string[];
  }> {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    const missingRequirements: string[] = [];

    if (!user.real_name) {
      missingRequirements.push('real_name');
    }

    if (!user.openclaw_workspace_id) {
      missingRequirements.push('openclaw_workspace_id');
    }

    return {
      isVerified: missingRequirements.length === 0,
      hasRealName: !!user.real_name,
      hasWorkspace: !!user.openclaw_workspace_id,
      isCreator: user.role === 'creator',
      missingRequirements,
    };
  }

  // Unbind workspace
  static async unbindWorkspace(user_id: string): Promise<void> {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ openclaw_workspace_id: undefined });

    // Log action
    await AuditLog.create({
      action: 'workspace_unbound',
      user_id,
      target_type: 'user',
      target_id: user_id,
      details: { unbound_at: new Date().toISOString() },
    });
  }

  // Validate workspace ID format
  private static validateWorkspaceId(workspaceId: string): boolean {
    // Expected format: alphanumeric with hyphens, 8-64 characters
    const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{7,63}$/;
    return pattern.test(workspaceId);
  }
}
