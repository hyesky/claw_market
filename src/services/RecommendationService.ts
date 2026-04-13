import { SoulProduct, SoulVersion, Order, User } from '../models';

export class RecommendationService {
  // Get personalized recommendations for user
  static async getPersonalized(
    user_id: string,
    limit = 10
  ): Promise<SoulProduct[]> {
    // Get user's purchase history
    const userOrders = await Order.findAll({
      where: { buyer_id: user_id, payment_status: 'paid' },
      attributes: ['product_id'],
    });

    const purchasedProductIds = userOrders.map((o) => o.product_id);

    // Get products from same agent types user has purchased
    const purchasedProducts = await SoulProduct.findAll({
      where: {
        id: purchasedProductIds,
        status: 'published',
      },
    });

    const agentTypes = Array.from(
      new Set(purchasedProducts.map((p) => p.agent_type).filter(Boolean))
    );

    // Get products with similar tags
    const purchasedTags = Array.from(
      new Set(
        purchasedProducts
          .flatMap((p) => p.personality_tags?.split(',').map((t) => t.trim()) || [])
          .filter(Boolean)
      )
    );

    // Build recommendation score for each product
    const allProducts = await SoulProduct.findAll({
      where: {
        status: 'published',
        id: { [Symbol.for('Op.notIn')]: purchasedProductIds },
      },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
      limit: 100,
    });

    const scoredProducts = allProducts.map((product) => {
      let score = 0;

      // Agent type match
      if (agentTypes.includes(product.agent_type || '')) {
        score += 10;
      }

      // Tag match
      const productTags = product.personality_tags?.split(',').map((t) => t.trim()) || [];
      const matchingTags = purchasedTags.filter((tag) => productTags.includes(tag));
      score += matchingTags.length * 3;

      // Model compatibility match
      const purchasedCompat = Array.from(
        new Set(purchasedProducts.map((p) => p.model_compatibility).filter(Boolean))
      );
      if (
        product.model_compatibility &&
        purchasedCompat.includes(product.model_compatibility)
      ) {
        score += 5;
      }

      // Price similarity (prefer similar price range)
      const avgPrice =
        purchasedProducts.reduce((sum, p) => sum + p.price, 0) /
        (purchasedProducts.length || 1);
      const priceDiff = Math.abs(product.price - avgPrice);
      if (priceDiff < avgPrice * 0.5) {
        score += 2;
      }

      return { product, score };
    });

    // Sort by score and return top N
    scoredProducts.sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, limit).map((sp) => sp.product);
  }

  // Get trending products
  static async getTrending(
    days = 7,
    limit = 10
  ): Promise<SoulProduct[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get products with most orders in last N days
    const orders = await Order.findAll({
      where: {
        payment_status: 'paid',
        created_at: { gte: startDate },
      },
      attributes: ['product_id'],
    });

    // Count orders per product
    const orderCount = new Map<string, number>();
    orders.forEach((order) => {
      orderCount.set(order.product_id, (orderCount.get(order.product_id) || 0) + 1);
    });

    // Get product details
    const productIds = Array.from(orderCount.keys());
    const products = await SoulProduct.findAll({
      where: { id: productIds, status: 'published' },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
    });

    // Sort by order count
    const scoredProducts = products.map((p) => ({
      product: p,
      count: orderCount.get(p.id) || 0,
    }));

    scoredProducts.sort((a, b) => b.count - a.count);

    return scoredProducts.slice(0, limit).map((sp) => sp.product);
  }

  // Get similar products
  static async getSimilar(
    product_id: string,
    limit = 5
  ): Promise<SoulProduct[]> {
    const product = await SoulProduct.findByPk(product_id, {
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
    });

    if (!product) {
      return [];
    }

    const allProducts = await SoulProduct.findAll({
      where: {
        status: 'published',
        id: { [Symbol.for('Op.ne')]: product_id },
      },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
      limit: 50,
    });

    const scoredProducts = allProducts.map((p) => {
      let score = 0;

      // Same agent type
      if (p.agent_type === product.agent_type && p.agent_type) {
        score += 20;
      }

      // Same model compatibility
      if (p.model_compatibility === product.model_compatibility && p.model_compatibility) {
        score += 15;
      }

      // Tag overlap
      const productTags = product.personality_tags?.split(',').map((t) => t.trim()) || [];
      const candidateTags = p.personality_tags?.split(',').map((t) => t.trim()) || [];
      const matchingTags = productTags.filter((tag) => candidateTags.includes(tag));
      score += matchingTags.length * 5;

      // Price similarity
      const priceDiff = Math.abs(p.price - product.price);
      const priceRatio = product.price > 0 ? priceDiff / product.price : 0;
      if (priceRatio < 0.3) {
        score += 10;
      } else if (priceRatio < 0.5) {
        score += 5;
      }

      return { product: p, score };
    });

    scoredProducts.sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, limit).map((sp) => sp.product);
  }

  // Get new releases
  static async getNewReleases(limit = 10): Promise<SoulProduct[]> {
    return SoulProduct.findAll({
      where: { status: 'published' },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
    });
  }

  // Get products by category (agent type)
  static async getByCategory(
    agent_type: string,
    limit = 20
  ): Promise<SoulProduct[]> {
    return SoulProduct.findAll({
      where: { status: 'published', agent_type },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
    });
  }

  // Get featured products (handpicked by admin)
  static async getFeatured(limit = 10): Promise<SoulProduct[]> {
    // For now, return top-rated products
    return SoulProduct.findAll({
      where: { status: 'published' },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
      order: [['price', 'DESC']], // Placeholder: could add a "featured" flag
      limit,
    });
  }

  // Get homepage recommendations
  static async getHomepageRecommendations(): Promise<{
    newReleases: SoulProduct[];
    trending: SoulProduct[];
    featured: SoulProduct[];
    categories: { name: string; products: SoulProduct[] }[];
  }> {
    const [newReleases, trending, featured, categories] = await Promise.all([
      this.getNewReleases(6),
      this.getTrending(7, 6),
      this.getFeatured(6),
      this.getCategoriesWithProducts(),
    ]);

    return { newReleases, trending, featured, categories };
  }

  // Get categories with sample products
  private static async getCategoriesWithProducts(): Promise<
    { name: string; products: SoulProduct[] }[]
  > {
    const allProducts = await SoulProduct.findAll({
      where: { status: 'published', agent_type: { [Symbol.for('Op.not')]: null } },
      attributes: ['agent_type'],
      raw: true,
    });

    const categories = Array.from(
      new Set(allProducts.map((p: any) => p.agent_type))
    );

    const categoryProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await SoulProduct.findAll({
          where: { status: 'published', agent_type: cat },
          limit: 4,
          order: [['created_at', 'DESC']],
        });
        return { name: cat, products };
      })
    );

    return categoryProducts;
  }
}