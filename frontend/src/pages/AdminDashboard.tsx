import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Settings,
  Bell,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const platformStats = [
    { label: '总用户数', value: '8,234', change: '+12.5%', icon: Users },
    { label: '商品总数', value: '456', change: '+8.2%', icon: FileText },
    { label: '今日订单', value: '128', change: '+15.3%', icon: ShoppingBag },
    { label: '平台收入', value: '¥156,789', change: '+22.1%', icon: DollarSign },
  ];

  const moderationQueue = [
    { id: 1, product: 'AI 助手专业版', creator: 'creator001', submitted: '10 分钟前', risk: 'low' },
    { id: 2, product: '商业谈判专家', creator: 'creator002', submitted: '25 分钟前', risk: 'medium' },
    { id: 3, product: '情感陪伴机器人', creator: 'creator003', submitted: '1 小时前', risk: 'low' },
    { id: 4, product: '黑客工具配置', creator: 'creator004', submitted: '2 小时前', risk: 'high' },
  ];

  const recentOrders = [
    { id: 'ORD-001', product: '贴心助理', buyer: 'user123', amount: 29.9, status: 'completed' },
    { id: 'ORD-002', product: '编程导师 Pro', buyer: 'dev_lover', amount: 59.9, status: 'completed' },
    { id: 'ORD-003', product: '创意写作助手', buyer: 'writer101', amount: 39.9, status: 'pending' },
    { id: 'ORD-004', product: '商务英语', buyer: 'business_pro', amount: 49.9, status: 'completed' },
    { id: 'ORD-005', product: '陪伴型聊天', buyer: 'daily_user', amount: 19.9, status: 'refunded' },
  ];

  const systemHealth = {
    database: { status: 'healthy', responseTime: '12ms' },
    api: { status: 'healthy', responseTime: '45ms' },
    storage: { status: 'healthy', usage: '68%' },
    cache: { status: 'healthy', hitRate: '94%' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
          <p className="text-gray-600 mt-1">平台概览与监控</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: '概览', icon: TrendingUp },
            { id: 'moderation', label: '内容审核', icon: AlertCircle },
            { id: 'users', label: '用户管理', icon: Users },
            { id: 'products', label: '商品管理', icon: FileText },
            { id: 'orders', label: '订单管理', icon: ShoppingBag },
            { id: 'settings', label: '系统设置', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Platform Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <stat.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Alerts & Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Moderation Queue */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">待审核内容</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {moderationQueue.length} 待处理
                </span>
              </div>
              <div className="space-y-4">
                {moderationQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg ${
                      item.risk === 'high'
                        ? 'border-red-300 bg-red-50'
                        : item.risk === 'medium'
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-sm text-gray-600">{item.creator} • {item.submitted}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.risk === 'high'
                            ? 'bg-red-100 text-red-700'
                            : item.risk === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-end space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                        通过
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                        拒绝
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">系统健康状态</h2>
              <div className="space-y-4">
                {Object.entries(systemHealth).map(([key, data]: any) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {key === 'database' ? '数据库' : key === 'api' ? 'API 服务' : key === 'storage' ? '存储' : '缓存'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {key === 'storage' ? `${data.usage} 已用` : data.responseTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">最近订单</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">订单号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">商品</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">买家</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">金额</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{order.product}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{order.buyer}</td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                        ¥{order.amount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.status === 'completed' ? '已完成' : order.status === 'pending' ? '待处理' : '已退款'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">内容审核队列</h2>
          <p className="text-gray-600">审核功能页面占位符</p>
        </div>
      )}

      {activeTab !== 'overview' && activeTab !== 'moderation' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {['users', 'products', 'orders', 'settings'].find((t) => t === activeTab) === 'users' && '用户管理'}
            {['users', 'products', 'orders', 'settings'].find((t) => t === activeTab) === 'products' && '商品管理'}
            {['users', 'products', 'orders', 'settings'].find((t) => t === activeTab) === 'orders' && '订单管理'}
            {['users', 'products', 'orders', 'settings'].find((t) => t === activeTab) === 'settings' && '系统设置'}
          </h2>
          <p className="text-gray-600">该功能页面正在开发中</p>
        </div>
      )}
    </div>
  );
}
