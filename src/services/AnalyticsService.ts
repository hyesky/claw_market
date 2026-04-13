import {
  SoulProduct,
  Order,
  Review,
  User,
  Transaction,
  ContentModeration,
} from '../models';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export class AnalyticsService {
  // Get creator statistics
  static async getCreatorStats(
    creator_id: string,
    period: 'day' | 'week' | 'month' | 'all' = 'all'
  ): Promise<{
    totalProducts: number;
    publishedProducts: number;
    totalDownloads: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    pendingModerations: number;
  }> {
    const startDate = this.getStartDate(period);

    const products = await SoulProduct.findAll({
      where: { creator_id },
    });

    const publishedProductIds = products
      .filter((p) => p.status === 'published')
      .map((p) => p.id);

    const orders = await Order.findAll({
      where: {
        payment_status: 'paid',
        product_id: { [Op.in]: publishedProductIds },
        ...(startDate ? { created_at: { gte: startDate } } : {}),
      },
      attributes: ['price'],
    });

    const reviews = await Review.findAll({
      where: { product_id: { [Op.in]: publishedProductIds } },
      attributes: ['rating'],
    });

    const productIds = products.map((p) => p.id);
    const moderations = await ContentModeration.count({
      where: {
        product_id: { [Op.in]: productIds },
        status: 'pending',
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.price), 0);
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      totalProducts: products.length,
      publishedProducts: publishedProductIds.length,
      totalDownloads: orders.length,
      totalRevenue,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      pendingModerations: moderations,
    };
  }

  // Get product statistics
  static async getProductStats(
    product_id: string,
    period: 'day' | 'week' | 'month' | 'all' = 'all'
  ): Promise<{
    totalDownloads: number;
    totalRevenue: number;
    downloadsTrend: { date: string; count: number }[];
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const startDate = this.getStartDate(period);

    const [orders, reviews] = await Promise.all([
      Order.findAll({
        where: {
          product_id,
          payment_status: 'paid',
          ...(startDate ? { created_at: { gte: startDate } } : {}),
        },
        attributes: ['price', 'created_at'],
      }),
      Review.findAll({
        where: { product_id },
        attributes: ['rating'],
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.price), 0);

    // Calculate downloads trend
    const downloadsByDate = new Map<string, number>();
    orders.forEach((order) => {
      const date = order.created_at.toISOString().split('T')[0];
      downloadsByDate.set(date, (downloadsByDate.get(date) || 0) + 1);
    });

    const downloadsTrend = Array.from(downloadsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (ratingDistribution.hasOwnProperty(r.rating)) {
        ratingDistribution[r.rating]++;
      }
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      totalDownloads: orders.length,
      totalRevenue,
      downloadsTrend,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  // Get platform statistics
  static async getPlatformStats(): Promise<{
    totalUsers: number;
    totalProducts: number;
    publishedProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    averageRating: number;
    pendingModerations: number;
    topAgentTypes: { type: string; count: number }[];
  }> {
    const [users, products, orders, transactions, moderations] = await Promise.all([
      User.count(),
      SoulProduct.findAll({}),
      Order.findAll({
        where: { payment_status: 'paid' },
        attributes: ['price'],
      }),
      Transaction.findAll({
        where: { type: 'commission', status: 'completed' },
        attributes: ['amount'],
      }),
      ContentModeration.count({ where: { status: 'pending' } }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.price), 0);
    const totalCommission = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    // Get all reviews for average rating
    const allReviews = await Review.findAll({
      attributes: ['rating'],
    });
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    // Get top agent types
    const allProducts = await SoulProduct.findAll({
      attributes: ['agent_type'],
    });

    const agentTypeCount = new Map<string, number>();
    allProducts.forEach((p) => {
      if (p.agent_type) {
        agentTypeCount.set(p.agent_type, (agentTypeCount.get(p.agent_type) || 0) + 1);
      }
    });

    const topAgentTypes = Array.from(agentTypeCount.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalUsers: users,
      totalProducts: products.length,
      publishedProducts: products.filter((p) => p.status === 'published').length,
      totalOrders: orders.length,
      totalRevenue,
      totalCommission,
      averageRating: parseFloat(averageRating.toFixed(1)),
      pendingModerations: moderations,
      topAgentTypes,
    };
  }

  // Get revenue over time
  static async getRevenueOverTime(
    period: 'day' | 'week' | 'month' = 'month',
    limit = 30
  ): Promise<{ date: string; revenue: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - limit);

    const orders = await Order.findAll({
      where: {
        payment_status: 'paid',
        created_at: { gte: startDate },
      },
      attributes: ['price', 'created_at'],
    });

    const revenueByDate = new Map<string, number>();

    orders.forEach((order) => {
      const date = order.created_at.toISOString().split('T')[0];
      revenueByDate.set(date, (revenueByDate.get(date) || 0) + Number(order.price));
    });

    return Array.from(revenueByDate.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Get conversion rate
  static async getConversionRate(
    period: 'day' | 'week' | 'month' | 'all' = 'all'
  ): Promise<{
    views: number;
    purchases: number;
    rate: number;
  }> {
    const publishedProducts = await SoulProduct.count({
      where: { status: 'published' },
    });

    const startDate = this.getStartDate(period);
    const orders = await Order.count({
      where: {
        payment_status: 'paid',
        ...(startDate ? { created_at: { gte: startDate } } : {}),
      },
    });

    // Estimate views as products * 100 (assumed average views per product)
    const estimatedViews = publishedProducts * 100;

    return {
      views: estimatedViews,
      purchases: orders,
      rate: estimatedViews > 0 ? parseFloat(((orders / estimatedViews) * 100).toFixed(2)) : 0,
    };
  }

  // Export data as CSV
  static async exportData(
    type: 'orders' | 'products' | 'users',
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    let data: any[] = [];

    switch (type) {
      case 'orders':
        data = await Order.findAll({
          raw: true,
          include: [
            {
              model: SoulProduct,
              as: 'product',
              attributes: ['title', 'slug'],
            },
          ],
        });
        break;
      case 'products':
        data = await SoulProduct.findAll({ raw: true });
        break;
      case 'users':
        data = await User.findAll({
          raw: true,
          attributes: ['id', 'email', 'role', 'status', 'created_at'],
        });
        break;
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // Convert to CSV
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((val) =>
            typeof val === 'string' && val.includes(',') ? `"${val}"` : val
          )
          .join(',')
      )
      .join('\n');

    return `${headers}\n${rows}`;
  }

  private static getStartDate(
    period: 'day' | 'week' | 'month' | 'all'
  ): Date | null {
    if (period === 'all') return null;

    const date = new Date();

    switch (period) {
      case 'day':
        date.setHours(0, 0, 0, 0);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
    }

    return date;
  }
}
