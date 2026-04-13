import { Filter } from 'lucide-react';

interface FilterSidebarProps {
  agentTypes: string[];
  models: string[];
  tags: string[];
  selectedAgentType: string;
  selectedModel: string;
  selectedTags: string[];
  priceRange: [number, number];
  onAgentTypeChange: (type: string) => void;
  onModelChange: (model: string) => void;
  onTagToggle: (tag: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  agentTypes,
  models,
  tags,
  selectedAgentType,
  selectedModel,
  selectedTags,
  priceRange,
  onAgentTypeChange,
  onModelChange,
  onTagToggle,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          筛选条件
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          清空
        </button>
      </div>

      {/* Agent Type */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Agent 类型</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="agentType"
              checked={selectedAgentType === ''}
              onChange={() => onAgentTypeChange('')}
              className="w-4 h-4 text-primary-600"
            />
            <span className="ml-2 text-sm text-gray-600">全部</span>
          </label>
          {agentTypes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="agentType"
                checked={selectedAgentType === type}
                onChange={() => onAgentTypeChange(type)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="ml-2 text-sm text-gray-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Model Compatibility */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">模型兼容</h4>
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">全部模型</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">价格范围</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) =>
              onPriceRangeChange([
                Math.min(Number(e.target.value), priceRange[1]),
                priceRange[1],
              ])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="最低"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              onPriceRangeChange([
                priceRange[0],
                Math.max(Number(e.target.value), priceRange[0]),
              ])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="最高"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">标签</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
