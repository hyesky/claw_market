import { Op } from 'sequelize';
import { SoulProduct, SoulVersion } from '../models';

export class VersionService {
  // Create new version
  static async createVersion(
    product_id: string,
    version: string,
    file_content: string
  ): Promise<SoulVersion> {
    // Validate semver format
    if (!/^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/.test(version)) {
      throw new Error('Invalid version format. Must be semantic version (e.g., 1.0.0).');
    }

    // Check if product exists
    const product = await SoulProduct.findByPk(product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if version already exists
    const existing = await SoulVersion.findOne({
      where: { product_id, version },
    });
    if (existing) {
      throw new Error('Version already exists');
    }

    // Set current latest version to false
    await SoulVersion.update(
      { is_latest: false },
      { where: { product_id, is_latest: true } }
    );

    // Create new version
    const newVersion = await SoulVersion.create({
      product_id,
      version,
      file_content,
      is_latest: true,
    });

    return newVersion;
  }

  // Get versions by product ID
  static async getVersionsByProduct(
    product_id: string
  ): Promise<SoulVersion[]> {
    return SoulVersion.findAll({
      where: { product_id },
      order: [['version', 'DESC'], ['created_at', 'DESC']],
    });
  }

  // Get latest version
  static async getLatestVersion(product_id: string): Promise<SoulVersion | null> {
    return SoulVersion.findOne({
      where: { product_id, is_latest: true },
    });
  }

  // Get specific version
  static async getVersion(
    product_id: string,
    version: string
  ): Promise<SoulVersion | null> {
    return SoulVersion.findOne({
      where: { product_id, version },
    });
  }

  // Set latest version
  static async setLatest(
    product_id: string,
    version: string
  ): Promise<SoulVersion> {
    const targetVersion = await this.getVersion(product_id, version);
    if (!targetVersion) {
      throw new Error('Version not found');
    }

    // Set all versions to not latest
    await SoulVersion.update(
      { is_latest: false },
      { where: { product_id, is_latest: true } }
    );

    // Set target version as latest
    targetVersion.is_latest = true;
    await targetVersion.save();

    return targetVersion;
  }

  // Rollback to specific version
  static async rollback(
    product_id: string,
    version: string
  ): Promise<SoulVersion> {
    return this.setLatest(product_id, version);
  }

  // Compare versions (returns -1, 0, or 1)
  static compareVersions(v1: string, v2: string): number {
    const parts1 = v1.replace('-', '.').replace('+', '.').split('.').map(Number);
    const parts2 = v2.replace('-', '.').replace('+', '.').split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (parts1[i] < parts2[i]) return -1;
      if (parts1[i] > parts2[i]) return 1;
    }
    return 0;
  }

  // Get version diff (simplified)
  static async getVersionDiff(
    product_id: string,
    v1: string,
    v2: string
  ): Promise<{
    version1: string;
    version2: string;
    content1: string;
    content2: string;
  }> {
    const version1 = await this.getVersion(product_id, v1);
    const version2 = await this.getVersion(product_id, v2);

    if (!version1 || !version2) {
      throw new Error('One or both versions not found');
    }

    return {
      version1: v1,
      version2: v2,
      content1: version1.file_content,
      content2: version2.file_content,
    };
  }

  // Delete version
  static async deleteVersion(
    product_id: string,
    version: string
  ): Promise<void> {
    const targetVersion = await this.getVersion(product_id, version);
    if (!targetVersion) {
      throw new Error('Version not found');
    }

    // Cannot delete the only version
    const count = await SoulVersion.count({ where: { product_id } });
    if (count <= 1) {
      throw new Error('Cannot delete the only version');
    }

    await targetVersion.destroy();
  }
}
