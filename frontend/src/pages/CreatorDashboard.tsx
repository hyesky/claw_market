import { useState } from 'react';
import {
  DollarSign,
  Download,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function CreatorDashboard() {
  const [dateRange, setDateRange] = useState('30d');

  const stats = [
    {
      label: '总收入',
      value: '¥12,458',
      change: '+15.2%',
      changeType: 'up',
      icon: DollarSign,
    },
    {
      label: '下载量',
      value: '1,234',
      change: '+8.5%',
      changeType: 'up',
      icon: Download,
    },
    {
      label: '活跃用户',
      value: '567',
      change: '-2.1%',
      changeType: 'down',
      icon: Users,
    },
    {
      label: '转化率',
      value: '4.2%',
      change: '+0.8%',
      changeType: 'up',
      icon: BarChart3,
    },
  ];

  const recentSales = [
    { product: '贴心助理小助手', amount: 29.9, time: '2 分钟前', customer: 'user123' },
    { product: '创意写作助手', amount: 39.9, time: '15 分钟前', customer: 'creative_writer' },
    { product: '编程导师 Pro', amount: 59.9, time: '32 分钟前', customer: 'dev_lover' },
    { product: '贴心助理小助手', amount: 29.9, time: '1 小时前', customer: 'daily_user' },
    { product: '商务谈判专家', amount: 89.9, time: '2 小时前', customer: 'business_pro' },
  ];

  const topProducts = [
    { id: 1, name: '贴心助理小助手', downloads: 456, revenue: '¥13,634' },
    { id: 2, name: '编程导师 Pro', downloads: 234, revenue: '¥14,016' },
    { id: 3, name: '创意写作助手', downloads: 189, revenue: '¥7,541' },
    { id: 4, name: '商务英语助手', downloads: 156, revenue: '¥9,360' },
    { id: 5, name: '陪伴型聊天机器人', downloads: 145, revenue: '¥4,350' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">数据看板</h1>
          <p className="text-gray-600 mt-1">查看您的创作者数据和分析</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">最近 7 天</option>
            <option value="30d">最近 30 天</option>
            <option value="90d">最近 90 天</option>
            <option value="1y">最近 1 年</option>
          </select>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            导出数据
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary-600" />
              </div>
              <span
                className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.changeType === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">收入趋势</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">图表区域 - 收入趋势图</p>
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>7 天前</span>
            <span>3 天前</span>
            <span>今天</span>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">最近订单</h2>
          <div className="space-y-4">
            {recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{sale.product}</p>
                  <p className="text-xs text-gray-500">{sale.time} • {sale.customer}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">+¥{sale.amount}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
            查看全部订单
          </button>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">热门商品</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">排名</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">商品名称</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">下载量</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">收入</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : index === 1
                          ? 'bg-gray-100 text-gray-700'
                          : index === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">{product.downloads}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                    {product.revenue}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      管理
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor Suggestions */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">优化建议</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">价格调整建议</h3>
            <p className="text-sm text-gray-600">
              您的"贴心助理小助手"定价为 ¥29.9，同类商品平均价格为 ¥34.9。考虑适当提高价格以增加收益。
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">扩展模型兼容性</h3>
            <p className="text-sm text-gray-600">
              热门商品平均兼容 3.5 个模型，您的商品平均兼容 2.1 个。建议增加对更多模型的支持。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
