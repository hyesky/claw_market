import { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';

export class ReviewController {
  // Submit review
  static async submit(req: Request, res: Response): Promise<void> {
    try {
      const { product_id } = req.params;
      const { rating, comment, images } = req.body;

      const review = await ReviewService.submitReview(
        product_id,
        req.user!.id,
        rating,
        comment,
        images
      );

      res.status(201).json({
        success: true,
        data: { review },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update review
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating, comment, images } = req.body;

      const review = await ReviewService.updateReview(id, req.user!.id, {
        rating,
        comment,
        images,
      });

      res.json({
        success: true,
        data: { review },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete review
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await ReviewService.deleteReview(id, req.user!.id);

      res.json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get product reviews
  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { product_id } = req.params;
      const { page, limit } = req.query;

      const { reviews, total, averageRating } = await ReviewService.getReviewsByProduct(
        product_id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10
      );

      res.json({
        success: true,
        data: {
          reviews,
          total,
          averageRating,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get product rating
  static async getRating(req: Request, res: Response): Promise<void> {
    try {
      const { product_id } = req.params;

      const rating = await ReviewService.getProductRating(product_id);

      res.json({
        success: true,
        data: { rating },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user reviews
  static async getUserReviews(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;

      const { reviews, total } = await ReviewService.getUserReviews(
        req.user!.id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10
      );

      res.json({
        success: true,
        data: {
          reviews,
          total,
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
