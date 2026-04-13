import { useState } from 'react';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { useEffect } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list({ limit: 8, sort: 'created_at', order: 'desc' })
      .then((res) => setProducts(res.data.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featuredProducts = products.slice(0, 4);
  const newReleases = products.slice(0, 4);

  const categories = [
    { type: 'assistant', label: '助手', icon: '🤖', count: 128 },
    { type: 'companion', label: '陪伴', icon: '💕', count: 86 },
    { type: 'tutor', label: '导师', icon: '📚', count: 54 },
    { type: 'creative', label: '创意', icon: '🎨', count: 42 },
    { type: 'professional', label: '专业', icon: '💼', count: 35 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              发现并交易 Agent 人格配置
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              基于 OpenClaw 生态的 Persona-as-a-Service 平台
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="搜索人格配置..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                搜索
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">浏览分类</h2>
          <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700">
            查看全部 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.type}
              to={`/products?agent_type=${category.type}`}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <span className="text-4xl">{category.icon}</span>
              <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                {category.label}
              </h3>
              <p className="text-sm text-gray-500">{category.count} 个配置</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">精选推荐</h2>
          </div>
          <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700">
            查看全部 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">最新上架</h2>
          </div>
          <Link to="/products?sort=created_at&order=desc" className="flex items-center text-primary-600 hover:text-primary-700">
            查看全部 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : newReleases.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">成为创作者</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            分享你设计的人格配置，通过 OpenClaw 生态获得收益
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              立即注册
            </Link>
            <Link
              to="/upload"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              上传配置
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex justify-between pt-4">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
