import { Request, Response } from 'express';
import { SearchService } from '../services/SearchService';

export class SearchController {
  // Search products
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { q, agent_type, model_compatibility, price_min, price_max, page, limit } = req.query;

      const filters: any = {
        agent_type: agent_type as string || undefined,
        model_compatibility: model_compatibility as string || undefined,
        price_min: price_min ? parseFloat(price_min as string) : undefined,
        price_max: price_max ? parseFloat(price_max as string) : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const { products, total, scores } = await SearchService.search(
        q as string || '',
        filters
      );

      res.json({
        success: true,
        data: {
          products,
          total,
          scores: Object.fromEntries(scores),
          query: q as string,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get search suggestions
  static async suggestions(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const suggestions = await SearchService.getSuggestions(q as string || '');

      res.json({
        success: true,
        data: { suggestions },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get filter options
  static async filters(req: Request, res: Response): Promise<void> {
    try {
      const options = await SearchService.getFilterOptions();

      res.json({
        success: true,
        data: { options },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get popular search terms
  static async popular(req: Request, res: Response): Promise<void> {
    try {
      const terms = await SearchService.getPopularSearchTerms();

      res.json({
        success: true,
        data: { terms },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
