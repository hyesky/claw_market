import { Op } from 'sequelize';
import { SoulProduct, SoulVersion, User } from '../models';

export class SearchService {
  private static index: Map<string, SoulProduct> = new Map();

  // Index product for search
  static async indexProduct(product: SoulProduct): Promise<void> {
    this.index.set(product.id, product);
  }

  // Remove product from index
  static async removeIndex(product_id: string): Promise<void> {
    this.index.delete(product_id);
  }

  // Rebuild entire index
  static async rebuildIndex(): Promise<void> {
    this.index.clear();
    const products = await SoulProduct.findAll({
      where: { status: 'published' },
      include: [
        {
          model: SoulVersion,
          as: 'versions',
          where: { is_latest: true },
          required: false,
        },
      ],
    });
    products.forEach((product) => this.index.set(product.id, product));
  }

  // Search products
  static async search(
    query: string,
    filters: {
      agent_type?: string;
      model_compatibility?: string;
      tags?: string[];
      price_min?: number;
      price_max?: number;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    products: SoulProduct[];
    total: number;
    scores: Map<string, number>;
  }> {
    const {
      agent_type,
      model_compatibility,
      tags,
      price_min,
      price_max,
      page = 1,
      limit = 20,
    } = filters;

    const where: { [key: string]: any } = { status: 'published' };

    // Apply filters
    if (agent_type) {
      where.agent_type = agent_type;
    }
    if (model_compatibility) {
      where.model_compatibility = model_compatibility;
    }
    if (price_min !== undefined || price_max !== undefined) {
      where.price = {};
      if (price_min !== undefined) (where.price as any)[Op.gte] = price_min;
      if (price_max !== undefined) (where.price as any)[Op.lte] = price_max;
    }
    if (tags && tags.length > 0) {
      where.personality_tags = { [Op.like]: `%${tags[0]}%` };
    }

    // Text search if query provided
    if (query && query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      const orConditions: any[] = [];

      searchTerms.forEach((term) => {
        orConditions.push({ title: { [Op.iLike]: `%${term}%` } });
        orConditions.push({ description: { [Op.iLike]: `%${term}%` } });
        orConditions.push({ slug: { [Op.iLike]: `%${term}%` } });
        orConditions.push({ personality_tags: { [Op.iLike]: `%${term}%` } });
      });

      (where as any)[Op.and] = [
        where,
        { [Op.or]: orConditions },
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
          attributes: ['id', 'real_name', 'email'],
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

    // Calculate relevance scores
    const scores = new Map<string, number>();
    if (query && query.trim()) {
      rows.forEach((product) => {
        let score = 0;
        const queryLower = query.toLowerCase();

        // Title match has highest weight
        if (product.title.toLowerCase().includes(queryLower)) {
          score += 10;
        }

        // Description match
        if (product.description?.toLowerCase().includes(queryLower)) {
          score += 5;
        }

        // Tags match
        if (product.personality_tags?.toLowerCase().includes(queryLower)) {
          score += 3;
        }

        // Model compatibility match
        if (product.model_compatibility?.toLowerCase().includes(queryLower)) {
          score += 2;
        }

        scores.set(product.id, score);
      });
    }

    return {
      products: rows,
      total: count,
      scores,
    };
  }

  // Get search suggestions
  static async getSuggestions(query: string, limit = 5): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const products = await SoulProduct.findAll({
      where: {
        status: 'published',
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { slug: { [Op.iLike]: `%${query}%` } },
          { agent_type: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ['title', 'slug', 'agent_type'],
      limit: limit * 2,
    });

    const suggestions = new Set<string>();
    products.forEach((product) => {
      suggestions.add(product.title);
      suggestions.add(product.slug);
      if (product.agent_type) suggestions.add(product.agent_type);
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Get popular search terms
  static async getPopularSearchTerms(limit = 10): Promise<{ term: string; count: number }[]> {
    // This would typically use analytics data
    // For now, return agent types as popular terms
    const products = await SoulProduct.findAll({
      where: { status: 'published' },
      attributes: [
        'agent_type',
        [SoulProduct.sequelize!.fn('COUNT', SoulProduct.sequelize!.col('id')), 'count'],
      ],
      group: ['agent_type'],
      order: [['count', 'DESC']],
      limit,
      raw: true,
    });

    return products
      .filter((p: any) => p.agent_type)
      .map((p: any) => ({ term: p.agent_type, count: Number(p.count) }));
  }

  // Get filter options
  static async getFilterOptions(): Promise<{
    agentTypes: string[];
    modelCompatibilities: string[];
    priceRange: { min: number; max: number };
    tags: string[];
  }> {
    const allProducts = await SoulProduct.findAll({
      where: { status: 'published' },
    });

    const agentTypesSet = new Set<string>();
    const modelCompatSet = new Set<string>();

    allProducts.forEach((p) => {
      if (p.agent_type) agentTypesSet.add(p.agent_type);
      if (p.model_compatibility) modelCompatSet.add(p.model_compatibility);
    });

    const agentTypes = Array.from(agentTypesSet);
    const modelCompatibilities = Array.from(modelCompatSet);

    const priceStats = await SoulProduct.max('price', {
      where: { status: 'published' },
      raw: true,
    });

    // Extract unique tags from personality_tags field
    const products = allProducts.filter((p) => p.personality_tags);

    const tagSet = new Set<string>();
    products.forEach((p) => {
      if (p.personality_tags) {
        p.personality_tags.split(',').forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed) tagSet.add(trimmed);
        });
      }
    });

    return {
      agentTypes: agentTypes.map((a: any) => a.agent_type),
      modelCompatibilities: modelCompatibilities.map((m: any) => m.model_compatibility),
      priceRange: {
        min: 0,
        max: Number(priceStats) || 0,
      },
      tags: Array.from(tagSet),
    };
  }

  // Get product preview snippet
  static getProductSnippet(product: SoulProduct, query?: string): string {
    const text = `${product.title} ${product.description || ''}`.toLowerCase();
    if (!query) {
      return product.description?.substring(0, 200) || product.title;
    }

    const idx = text.indexOf(query.toLowerCase());
    if (idx === -1) {
      return product.description?.substring(0, 200) || product.title;
    }

    const start = Math.max(0, idx - 50);
    const end = Math.min(text.length, idx + query.length + 150);
    const snippet = product.description?.substring(start, end) || product.title;

    return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
  }
}
