import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { VersionService } from '../services/VersionService';

export class ProductController {
  // Create product
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, slug, description, agent_type, model_compatibility, personality_tags, price, currency } = req.body;

      const product = await ProductService.createProduct(
        req.user!.id,
        title,
        slug,
        description,
        agent_type,
        model_compatibility,
        personality_tags,
        price,
        currency
      );

      res.status(201).json({
        success: true,
        data: { product },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get product by slug
  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        data: { product },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // List products
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, status, agent_type, model_compatibility, search } = req.query;

      const filters: any = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string || undefined,
        agent_type: agent_type as string || undefined,
        model_compatibility: model_compatibility as string || undefined,
        search: search as string || undefined,
      };

      const { products, total } = await ProductService.listProducts(filters);

      res.json({
        success: true,
        data: {
          products,
          total,
          page: filters.page || 1,
          limit: filters.limit || 20,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update product
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await ProductService.updateProduct(id, updates);

      res.json({
        success: true,
        data: { product },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete product
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await ProductService.deleteProduct(id);

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Publish product
  static async publish(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await ProductService.publishProduct(id);

      res.json({
        success: true,
        data: { product },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Archive product
  static async archive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await ProductService.archiveProduct(id);

      res.json({
        success: true,
        data: { product },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Create version
  static async createVersion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { version, file_content } = req.body;

      const soulVersion = await VersionService.createVersion(id, version, file_content);

      res.status(201).json({
        success: true,
        data: { version: soulVersion },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get versions
  static async getVersions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const versions = await VersionService.getVersionsByProduct(id);

      res.json({
        success: true,
        data: { versions },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Set latest version
  static async setLatest(req: Request, res: Response): Promise<void> {
    try {
      const { id, version } = req.params;

      const latest = await VersionService.setLatest(id, version);

      res.json({
        success: true,
        data: { version: latest },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
