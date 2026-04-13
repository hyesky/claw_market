import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Download } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import PersonalitySandbox from '../components/PersonalitySandbox';
import { productsApi, reviewsApi } from '../services/api';
import { Product, Version, Review } from '../types';
import { useCart } from '../hooks/useCart';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'reviews' | 'sandbox'>('overview');
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      productsApi.getBySlug(slug),
      productsApi.getVersions(product?.id || ''),
      reviewsApi.get(product?.id || ''),
    ])
      .then(([productRes, versionsRes, reviewsRes]) => {
        setProduct(productRes.data.data.product);
        setVersions(versionsRes.data.data.versions);
        setReviews(reviewsRes.data.data.reviews);
        const latest = versionsRes.data.data.versions.find((v: Version) => v.is_latest);
        setSelectedVersion(latest || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">加载中...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">商品不存在</div>;
  }

  const rating = product.rating || 0;
  const reviewsCount = product.reviews_count || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-primary-600">首页</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">商品</Link>
        <span>/</span>
        <span className="text-gray-900">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Product Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="text-gray-500 mt-1">@{product.slug}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Agent Type Badge */}
            <div className="mt-4 flex items-center space-x-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {getAgentTypeLabel(product.agent_type)}
              </span>
              <span className="text-sm text-gray-600">
                兼容：{product.model_compatibility.join(', ')}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.personality_tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="mt-6 flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-gray-500">({reviewsCount} 条评价)</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['overview', 'versions', 'reviews', 'sandbox'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {getTabLabel(tab)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">产品概述</h3>
                  <p className="text-gray-700">{product.description}</p>
                  <h4 className="text-md font-semibold text-gray-900 mt-6 mb-2">特性</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>支持 {product.model_compatibility.join('、')} 模型</li>
                    <li>{product.personality_tags.join('、')} 人格特质</li>
                    <li>包含 {versions.length} 个版本</li>
                  </ul>
                </div>
              )}

              {activeTab === 'versions' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">版本历史</h3>
                  <div className="space-y-4">
                    {versions.map((version) => (
                      <div
                        key={version.id}
                        onClick={() => setSelectedVersion(version)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedVersion?.id === version.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              v{version.version}
                            </span>
                            {version.is_latest && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                最新
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(version.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">用户评价</h3>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500">暂无评价</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{review.buyer_id}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && <p className="text-gray-700">{review.comment}</p>}
                          <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sandbox' && (
                <PersonalitySandbox
                  product={product}
                  version={selectedVersion ?? versions.find((v) => v.is_latest)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              ¥{product.price}
            </div>
            <p className="text-gray-600 mb-6">一次性购买，永久授权</p>

            <button
              onClick={() => addItem(product, selectedVersion ?? undefined)}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>加入购物车</span>
            </button>

            <button className="w-full mt-3 bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>立即购买</span>
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">授权类型</span>
                <span className="text-gray-900">个人使用</span>
              </div>
            </div>

            {/* Author Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">创作者</p>
                  <p className="text-xs text-gray-500">{product.id.slice(0, 8)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">相关商品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for related products */}
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCard
              key={i}
              product={{
                id: `related-${i}`,
                creator_id: '1',
                title: `相关商品 ${i + 1}`,
                slug: `related-${i}`,
                description: '这是一个相关商品',
                agent_type: 'assistant',
                model_compatibility: ['GPT-4'],
                personality_tags: ['helpful', 'friendly'],
                price: 29.9,
                currency: 'CNY',
                status: 'active',
                rating: 4.5,
                reviews_count: 10,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }}
            />
          ))}
        </div>
      </section>
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

function getTabLabel(tab: string): string {
  const labels: Record<string, string> = {
    overview: '概述',
    versions: '版本',
    reviews: '评价',
    sandbox: '沙箱预览',
  };
  return labels[tab] || tab;
}
