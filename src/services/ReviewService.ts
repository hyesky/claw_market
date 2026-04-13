import { Op } from 'sequelize';
import { Review, User, SoulProduct } from '../models';
import AuditLog from '../models/AuditLog';

export class ReviewService {
  // Submit review
  static async submitReview(
    product_id: string,
    buyer_id: string,
    rating: number,
    comment?: string,
    images?: string
  ): Promise<Review> {
    // Verify product exists
    const product = await SoulProduct.findByPk(product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Verify buyer exists
    const user = await User.findByPk(buyer_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { product_id, buyer_id },
    });
    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Create review
    const review = await Review.create({
      product_id,
      buyer_id,
      rating,
      comment,
      images,
    });

    // Log action
    await AuditLog.create({
      action: 'review_submitted',
      user_id: buyer_id,
      target_type: 'product',
      target_id: product_id,
      details: { rating, review_id: review.id },
    });

    return review;
  }

  // Update review
  static async updateReview(
    review_id: string,
    buyer_id: string,
    updates: { rating?: number; comment?: string; images?: string }
  ): Promise<Review> {
    const review = await Review.findByPk(review_id);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.buyer_id !== buyer_id) {
      throw new Error('Unauthorized');
    }

    await review.update(updates);

    // Log action
    await AuditLog.create({
      action: 'review_updated',
      user_id: buyer_id,
      target_type: 'review',
      target_id: review_id,
      details: updates,
    });

    return review;
  }

  // Delete review
  static async deleteReview(review_id: string, buyer_id: string): Promise<void> {
    const review = await Review.findByPk(review_id);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.buyer_id !== buyer_id) {
      throw new Error('Unauthorized');
    }

    await review.destroy();

    // Log action
    await AuditLog.create({
      action: 'review_deleted',
      user_id: buyer_id,
      target_type: 'review',
      target_id: review_id,
    });
  }

  // Get reviews by product
  static async getReviewsByProduct(
    product_id: string,
    page = 1,
    limit = 10
  ): Promise<{ reviews: Review[]; total: number; averageRating: number }> {
    const { count, rows } = await Review.findAndCountAll({
      where: { product_id },
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'email', 'real_name', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Calculate average rating
    const avgResult = await Review.max('rating', { where: { product_id } });
    const avgRating = Number(avgResult) || 0;

    return {
      reviews: rows,
      total: count,
      averageRating: avgRating,
    };
  }

  // Get product rating
  static async getProductRating(product_id: string): Promise<{
    averageRating: number;
    totalCount: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const reviews = await Review.findAll({
      where: { product_id },
      attributes: ['rating'],
    });

    const totalCount = reviews.length;
    const averageRating =
      totalCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
        : 0;

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (ratingDistribution.hasOwnProperty(r.rating)) {
        ratingDistribution[r.rating]++;
      }
    });

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalCount,
      ratingDistribution,
    };
  }

  // Get user reviews
  static async getUserReviews(
    buyer_id: string,
    page = 1,
    limit = 10
  ): Promise<{ reviews: Review[]; total: number }> {
    const { count, rows } = await Review.findAndCountAll({
      where: { buyer_id },
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: SoulProduct,
          as: 'product',
          attributes: ['id', 'title', 'slug'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return { reviews: rows, total: count };
  }
}
