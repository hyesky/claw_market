import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { ordersApi } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [authorizationType, setAuthorizationType] = useState('personal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const paymentMethods = [
    { id: 'alipay', label: '支付宝', icon: '🟢' },
    { id: 'wechat', label: '微信支付', icon: '🟢' },
    { id: 'card', label: '信用卡', icon: '💳' },
  ];

  const authorizationTypes = [
    { id: 'personal', label: '个人使用', description: '仅限个人学习、研究使用' },
    { id: 'commercial', label: '商业使用', description: '可在商业项目中使用，需注明来源' },
    { id: 'enterprise', label: '企业授权', description: '企业内部使用，包含技术支持' },
  ];

  const handlePay = async () => {
    if (!agreed) return;

    setIsProcessing(true);
    try {
      // Create order
      const firstItem = items[0];
      const orderRes = await ordersApi.create({
        product_id: firstItem.product.id,
        version_id: firstItem.version?.id,
        price: total,
        authorization_type: authorizationType,
      });

      const orderId = orderRes.data.data.order.id;

      // Process payment
      await ordersApi.pay(orderId, {
        payment_method: paymentMethod,
      });

      // Clear cart and redirect
      clear();
      navigate('/order/success', { state: { orderId } });
    } catch (error) {
      console.error('Payment error:', error);
      alert('支付失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        返回商品列表
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">订单确认</h1>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{getAgentEmoji(item.product.agent_type)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">{item.product.description.slice(0, 50)}...</p>
                    {item.version && (
                      <p className="text-xs text-gray-500 mt-1">版本：v{item.version.version}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">¥{item.product.price}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="space-y-2 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>商品小计</span>
                <span>¥{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>平台服务费</span>
                <span>¥{(total * 0.05).toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-900">总计</span>
              <span className="text-3xl font-bold text-primary-600">
                ¥{(total * 1.05).toFixed(2)}
              </span>
            </div>

            {/* Authorization Agreement */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">授权协议</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    请选择您需要的授权类型，并阅读相关条款
                  </p>
                  <div className="space-y-3">
                    {authorizationTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-start space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="authorizationType"
                          checked={authorizationType === type.id}
                          onChange={() => setAuthorizationType(type.id)}
                          className="w-4 h-4 text-primary-600 mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{type.label}</span>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start space-x-2 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded mt-0.5"
              />
              <span className="text-sm text-gray-600">
                我已阅读并同意{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  服务条款
                </a>{' '}
                和{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  隐私政策
                </a>
              </span>
            </label>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={!agreed || isProcessing}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? '处理中...' : `支付 ¥${(total * 1.05).toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">支付方式</h2>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="w-4 h-4 text-primary-600"
                  />
                </label>
              ))}
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <Check className="w-5 h-5" />
                <span className="font-medium">安全支付</span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                我们使用加密技术保护您的支付信息安全
              </p>
            </div>

            {/* Contact Support */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                遇到问题？{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  联系客户服务
                </a>
              </p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">发票信息</h2>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">不需要发票</option>
              <option value="personal">个人发票</option>
              <option value="company">企业发票</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAgentEmoji(type: string): string {
  const emojis: Record<string, string> = {
    assistant: '🤖',
    companion: '💕',
    tutor: '📚',
    creative: '🎨',
    professional: '💼',
  };
  return emojis[type] || '🦋';
}
