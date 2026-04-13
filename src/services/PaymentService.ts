import { Order, OrderItem, AuthorizationRecord, User, SoulProduct } from '../models';

export class PaymentService {
  // Create order
  static async createOrder(
    buyer_id: string,
    product_id: string,
    version_id: string,
    price: number,
    currency = 'CNY',
    authorization_type?: string
  ): Promise<Order> {
    // Verify user exists
    const user = await User.findByPk(buyer_id);
    if (!user) {
      throw new Error('Buyer not found');
    }

    // Verify product exists
    const product = await SoulProduct.findByPk(product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Create order
    const order = await Order.create({
      buyer_id,
      product_id,
      version_id,
      price,
      currency,
      authorization_type,
      payment_status: 'pending',
    });

    return order;
  }

  // Process payment
  static async processPayment(
    order_id: string,
    payment_method: string,
    payment_data: any
  ): Promise<Order> {
    const order = await Order.findByPk(order_id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.payment_status !== 'pending') {
      throw new Error('Order is not in pending state');
    }

    // Here you would integrate with actual payment gateway
    // For now, we simulate successful payment
    const paymentSuccessful = await this.simulatePayment(payment_data);

    if (!paymentSuccessful) {
      await order.update({ payment_status: 'failed' });
      throw new Error('Payment failed');
    }

    // Update order status
    await order.update({
      payment_status: 'paid',
      payment_method,
      completed_at: new Date(),
    });

    // Create authorization record
    await AuthorizationRecord.create({
      order_id: order.id,
      workspace_id: order.buyer_id, // In real implementation, get from user's workspace
      authorization_scope: order.authorization_type || 'personal',
      expires_at: this.calculateExpiration(order.authorization_type) || undefined,
    });

    return order;
  }

  // Simulate payment (placeholder for real payment gateway)
  private static async simulatePayment(paymentData: any): Promise<boolean> {
    // In production, this would call Alipay/WeChat Pay/Credit Card API
    // For now, return true if payment data is present
    return !!paymentData;
  }

  // Calculate authorization expiration
  private static calculateExpiration(
    authorizationType?: string
  ): Date | null {
    const now = new Date();

    switch (authorizationType) {
      case 'personal':
        // 1 year for personal use
        now.setFullYear(now.getFullYear() + 1);
        return now;
      case 'commercial':
        // 2 years for commercial use
        now.setFullYear(now.getFullYear() + 2);
        return now;
      case 'enterprise':
        // No expiration for enterprise
        return null;
      default:
        // Default: 1 year
        now.setFullYear(now.getFullYear() + 1);
        return now;
    }
  }

  // Refund order
  static async refundOrder(order_id: string): Promise<Order> {
    const order = await Order.findByPk(order_id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.payment_status !== 'paid') {
      throw new Error('Order has not been paid');
    }

    // Here you would integrate with actual payment gateway for refund
    // For now, we simulate successful refund

    await order.update({ payment_status: 'refunded' });

    // Revoke authorization
    await AuthorizationRecord.destroy({ where: { order_id } });

    return order;
  }

  // Get order by ID
  static async getOrderById(order_id: string): Promise<Order | null> {
    return Order.findByPk(order_id, {
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'email', 'real_name', 'role'],
        },
        {
          model: SoulProduct,
          as: 'product',
          attributes: ['id', 'title', 'slug', 'price', 'currency'],
        },
        {
          model: AuthorizationRecord,
          as: 'authorizations',
        },
      ],
    });
  }

  // Get orders by buyer
  static async getOrdersByBuyer(
    buyer_id: string,
    page = 1,
    limit = 20
  ): Promise<{ orders: Order[]; total: number }> {
    const { count, rows } = await Order.findAndCountAll({
      where: { buyer_id },
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: SoulProduct,
          as: 'product',
          attributes: ['id', 'title', 'slug', 'price', 'currency'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return { orders: rows, total: count };
  }

  // Get order statistics
  static async getOrderStatistics(): Promise<{
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    completed_orders: number;
    failed_orders: number;
  }> {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { payment_status: 'pending' } });
    const completedOrders = await Order.count({ where: { payment_status: 'paid' } });
    const failedOrders = await Order.count({ where: { payment_status: 'failed' } });

    const revenueResult = await Order.sum('price');

    return {
      total_orders: totalOrders,
      total_revenue: Number(revenueResult) || 0,
      pending_orders: pendingOrders,
      completed_orders: completedOrders,
      failed_orders: failedOrders,
    };
  }
}
