import { Op } from 'sequelize';
import { SoulProduct, SoulVersion, SoulBundle } from '../models';
import User from '../models/User';

export class ProductService {
  // Create new product
  static async createProduct(
    creator_id: string,
    title: string,
    slug: string,
    description?: string,
    agent_type?: string,
    model_compatibility?: string,
    personality_tags?: string,
    price = 0,
    currency = 'CNY'
  ): Promise<SoulProduct> {
    // Validate slug format
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      throw new Error('Invalid slug format. Must be lowercase alphanumeric with hyphens.');
    }

    // Check if slug already exists
    const existing = await SoulProduct.findOne({ where: { slug } });
    if (existing) {
      throw new Error('Slug already exists');
    }

    // Create product
    const product = await SoulProduct.create({
      creator_id,
      title,
      slug,
      description,
      agent_type,
      model_compatibility,
      personality_tags,
      price,
      currency,
      status: 'draft',
    });

    return product;
  }

  // Get product by ID
  static async getProductById(id: string): Promise<SoulProduct | null> {
    return SoulProduct.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'real_name', 'role'],
        },
        {
          model: SoulVersion,
          as: 'versions',
          order: [['created_at', 'DESC']],
        },
      ],
    });
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<SoulProduct | null> {
    return SoulProduct.findOne({
      where: { slug, status: 'published' },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'real_name', 'role'],
        },
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
        },
      ],
    });
  }

  // List products with filters
  static async listProducts(
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      agent_type?: string;
      model_compatibility?: string;
      creator_id?: string;
      search?: string;
    } = {}
  ): Promise<{ products: SoulProduct[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      status,
      agent_type,
      model_compatibility,
      creator_id,
      search,
    } = filters;

    const where: { [key: string]: any } = {};

    if (status) {
      where.status = status;
    }
    if (agent_type) {
      where.agent_type = agent_type;
    }
    if (model_compatibility) {
      where.model_compatibility = model_compatibility;
    }
    if (creator_id) {
      where.creator_id = creator_id;
    }
    if (search) {
      (where as any)[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await SoulProduct.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'real_name', 'role'],
        },
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return { products: rows, total: count };
  }

  // Update product
  static async updateProduct(
    id: string,
    updates: {
      title?: string;
      description?: string;
      agent_type?: string;
      model_compatibility?: string;
      personality_tags?: string;
      price?: number;
      currency?: string;
      status?: 'draft' | 'published' | 'archived' | 'rejected';
    }
  ): Promise<SoulProduct> {
    const product = await SoulProduct.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.update(updates);
    return product;
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    const product = await SoulProduct.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();
  }

  // Archive product
  static async archiveProduct(id: string): Promise<SoulProduct> {
    return this.updateProduct(id, { status: 'archived' });
  }

  // Publish product
  static async publishProduct(id: string): Promise<SoulProduct> {
    return this.updateProduct(id, { status: 'published' });
  }
}
