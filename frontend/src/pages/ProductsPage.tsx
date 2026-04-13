import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { productsApi, searchApi } from '../services/api';
import { Product } from '../types';
import { mockProducts, mockFilters, mockTotal } from '../data/mockProducts';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedAgentType, setSelectedAgentType] = useState(searchParams.get('agent_type') || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',') || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');

  // Filter options
  const [agentTypes, setAgentTypes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const page = Number(searchParams.get('page') || 1);
  const limit = 12;

  useEffect(() => {
    // Fetch filter options - use mock data as fallback
    searchApi.filters()
      .then((res) => {
        setAgentTypes(res.data.data.agent_types);
        setModels(res.data.data.models);
        setTags(res.data.data.tags);
      })
      .catch(() => {
        // Use mock data if API fails
        setAgentTypes(mockFilters.agent_types);
        setModels(mockFilters.models);
        setTags(mockFilters.tags);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {
      limit,
      page,
      sort: sortBy,
      order: sortOrder,
    };

    if (selectedAgentType) params.agent_type = selectedAgentType;
    if (selectedModel) params.model = selectedModel;
    if (selectedTags.length) params.tags = selectedTags.join(',');
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.price_min = priceRange[0];
      params.price_max = priceRange[1];
    }

    productsApi.list(params)
      .then((res) => {
        setProducts(res.data.data.products);
        setTotal(res.data.data.total);
      })
      .catch(() => {
        // Use mock data if API fails
        let filteredProducts = [...mockProducts];

        // Apply filters to mock data
        if (selectedAgentType) {
          filteredProducts = filteredProducts.filter((p) => p.agent_type === selectedAgentType);
        }
        if (selectedModel) {
          filteredProducts = filteredProducts.filter((p) => p.models.includes(selectedModel));
        }
        if (selectedTags.length) {
          filteredProducts = filteredProducts.filter((p) =>
            selectedTags.some((tag) => p.tags.includes(tag))
          );
        }
        if (priceRange[0] > 0 || priceRange[1] < 1000) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
          );
        }

        // Sort
        const sortDesc = sortOrder === 'desc';
        filteredProducts.sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'rating':
              comparison = a.rating - b.rating;
              break;
            case 'created_at':
            default:
              comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              break;
          }
          return sortDesc ? -comparison : comparison;
        });

        // Paginate
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

        setProducts(paginatedProducts);
        setTotal(filteredProducts.length);
      })
      .finally(() => setLoading(false));
  }, [selectedAgentType, selectedModel, selectedTags, priceRange, sortBy, sortOrder, page]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedAgentType('');
    setSelectedModel('');
    setSelectedTags([]);
    setPriceRange([0, 1000]);
  };

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            agentTypes={agentTypes}
            models={models}
            tags={tags}
            selectedAgentType={selectedAgentType}
            selectedModel={selectedModel}
            selectedTags={selectedTags}
            priceRange={priceRange}
            onAgentTypeChange={(type) => {
              setSelectedAgentType(type);
              updateSearchParams('agent_type', type);
            }}
            onModelChange={(model) => {
              setSelectedModel(model);
              updateSearchParams('model', model);
            }}
            onTagToggle={(tag) => {
              handleTagToggle(tag);
              const newTags = selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag];
              updateSearchParams('tags', newTags.join(','));
            }}
            onPriceRangeChange={setPriceRange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedAgentType ? `${selectedAgentType} 类型` : '全部商品'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                找到 {total} 个结果
              </p>
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort);
                setSortOrder(order);
                updateSearchParams('sort', sort);
                updateSearchParams('order', order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="created_at-desc">最新上架</option>
              <option value="created_at-asc">最早上架</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="rating-desc">评分最高</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到匹配的商品</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                清除筛选条件
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => updateSearchParams('page', String(page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
                <button
                  key={p}
                  onClick={() => updateSearchParams('page', String(p))}
                  className={`px-4 py-2 border rounded-lg text-sm ${
                    page === p
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => updateSearchParams('page', String(page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
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
