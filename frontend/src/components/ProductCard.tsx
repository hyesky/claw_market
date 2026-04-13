import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getAgentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      assistant: 'bg-blue-100 text-blue-700',
      companion: 'bg-pink-100 text-pink-700',
      tutor: 'bg-green-100 text-green-700',
      creative: 'bg-purple-100 text-purple-700',
      professional: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link to={`/product/${product.slug}`}>
        {/* Product image/preview */}
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <span className="text-4xl">{getEmoji(product.agent_type)}</span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Agent type badge */}
          <span className={`text-xs px-2 py-1 rounded-full ${getAgentTypeBadge(product.agent_type)}`}>
            {getAgentTypeLabel(product.agent_type)}
          </span>

          {/* Title */}
          <h3 className="mt-2 text-lg font-semibold text-gray-900 truncate">
            {product.title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.personality_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {product.personality_tags.length > 3 && (
              <span className="text-xs text-gray-500">+{product.personality_tags.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {product.rating?.toFixed(1) || 'N/A'}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviews_count || 0})
              </span>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-lg font-bold text-primary-600">
                ¥{product.price}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-between">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              查看详情
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}

function getAgentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    assistant: '助手',
    companion: '陪伴',
    tutor: '导师',
    creative: '创意',
    professional: '专业',
  };
  return labels[type] || type;
}

function getEmoji(type: string): string {
  const emojis: Record<string, string> = {
    assistant: '🤖',
    companion: '💕',
    tutor: '📚',
    creative: '🎨',
    professional: '💼',
  };
  return emojis[type] || '🦋';
}
