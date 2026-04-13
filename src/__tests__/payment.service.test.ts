/// <reference types="jest" />

import { PaymentService } from '../services/PaymentService';

// Mock models
jest.mock('../models', () => {
  const mockOrder = {
    id: 'order-123',
    buyer_id: 'buyer-123',
    product_id: 'product-123',
    version_id: 'version-123',
    price: 99.99,
    currency: 'CNY',
    payment_status: 'pending',
    update: jest.fn(),
    save: jest.fn(),
  };

  const mockUser = {
    id: 'buyer-123',
    email: 'buyer@test.com',
    real_name: 'Test Buyer',
    role: 'buyer',
  };

  const mockProduct = {
    id: 'product-123',
    title: 'Test Product',
    slug: 'test-product',
    price: 99.99,
    currency: 'CNY',
  };

  return {
    Order: {
      create: jest.fn().mockResolvedValue(mockOrder),
      findByPk: jest.fn().mockImplementation((id) => {
        if (id === 'order-123') return Promise.resolve(mockOrder);
        if (id === 'order-not-found') return Promise.resolve(null);
        return Promise.resolve(mockOrder);
      }),
      update: jest.fn(),
      count: jest.fn().mockResolvedValue(10),
      max: jest.fn(),
      sum: jest.fn().mockResolvedValue(999.99),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [mockOrder] }),
    },
    OrderItem: {},
    AuthorizationRecord: {
      create: jest.fn(),
      destroy: jest.fn(),
    },
    User: {
      findByPk: jest.fn().mockImplementation((id) => {
        if (id === 'buyer-123') return Promise.resolve(mockUser);
        if (id === 'buyer-not-found') return Promise.resolve(null);
        return Promise.resolve(mockUser);
      }),
    },
    SoulProduct: {
      findByPk: jest.fn().mockImplementation((id) => {
        if (id === 'product-123') return Promise.resolve(mockProduct);
        if (id === 'product-not-found') return Promise.resolve(null);
        return Promise.resolve(mockProduct);
      }),
    },
  };
});

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const order = await PaymentService.createOrder(
        'buyer-123',
        'product-123',
        'version-123',
        99.99,
        'CNY',
        'personal'
      );

      expect(order.id).toBe('order-123');
      expect(order.payment_status).toBe('pending');
    });

    it('should throw error when buyer not found', async () => {
      await expect(
        PaymentService.createOrder(
          'buyer-not-found',
          'product-123',
          'version-123',
          99.99,
          'CNY'
        )
      ).rejects.toThrow('Buyer not found');
    });

    it('should throw error when product not found', async () => {
      const { Order, User } = jest.requireMock('../models');
      User.findByPk.mockResolvedValueOnce(mockUser);
      SoulProduct.findByPk.mockResolvedValueOnce(null);

      await expect(
        PaymentService.createOrder(
          'buyer-123',
          'product-not-found',
          'version-123',
          99.99,
          'CNY'
        )
      ).rejects.toThrow('Product not found');
    });

    it('should use default currency when not provided', async () => {
      const order = await PaymentService.createOrder(
        'buyer-123',
        'product-123',
        'version-123',
        99.99
      );

      expect(order.currency).toBe('CNY');
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findByPk.mockResolvedValueOnce({
        ...mockOrder,
        payment_status: 'pending',
        update: jest.fn(),
      });

      const order = await PaymentService.processPayment(
        'order-123',
        'alipay',
        { transaction_id: 'txn-123' }
      );

      expect(order.payment_status).toBe('paid');
    });

    it('should throw error when order not found', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findByPk.mockResolvedValueOnce(null);

      await expect(
        PaymentService.processPayment('order-not-found', 'alipay', {})
      ).rejects.toThrow('Order not found');
    });

    it('should throw error when order is not pending', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findByPk.mockResolvedValueOnce({
        ...mockOrder,
        payment_status: 'paid',
      });

      await expect(
        PaymentService.processPayment('order-123', 'alipay', {})
      ).rejects.toThrow('Order is not in pending state');
    });

    it('should mark order as failed when payment fails', async () => {
      const { Order } = jest.requireMock('../models');
      const mockOrderFailed = {
        ...mockOrder,
        payment_status: 'pending',
        update: jest.fn(),
      };
      Order.findByPk.mockResolvedValueOnce(mockOrderFailed);

      await expect(
        PaymentService.processPayment('order-123', 'alipay', null)
      ).rejects.toThrow('Payment failed');
    });
  });

  describe('refundOrder', () => {
    it('should refund order successfully', async () => {
      const { Order } = jest.requireMock('../models');
      const mockPaidOrder = {
        ...mockOrder,
        payment_status: 'paid',
        update: jest.fn(),
      };
      Order.findByPk.mockResolvedValueOnce(mockPaidOrder);

      const order = await PaymentService.refundOrder('order-123');

      expect(order.payment_status).toBe('refunded');
    });

    it('should throw error when order not found', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findByPk.mockResolvedValueOnce(null);

      await expect(PaymentService.refundOrder('order-not-found')).rejects.toThrow(
        'Order not found'
      );
    });

    it('should throw error when order has not been paid', async () => {
      const { Order } = jest.requireMock('../models');
      const mockPendingOrder = {
        ...mockOrder,
        payment_status: 'pending',
        update: jest.fn(),
      };
      Order.findByPk.mockResolvedValueOnce(mockPendingOrder);

      await expect(PaymentService.refundOrder('order-123')).rejects.toThrow(
        'Order has not been paid'
      );
    });
  });

  describe('getOrderById', () => {
    it('should get order by ID with includes', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findByPk.mockResolvedValueOnce(mockOrder);

      const order = await PaymentService.getOrderById('order-123');

      expect(order).toBeDefined();
      expect(Order.findByPk).toHaveBeenCalledWith('order-123', expect.any(Object));
    });

    it('should return null when order not found', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findByPk.mockResolvedValueOnce(null);

      const order = await PaymentService.getOrderById('order-not-found');

      expect(order).toBeNull();
    });
  });

  describe('getOrdersByBuyer', () => {
    it('should get orders by buyer with pagination', async () => {
      const { Order } = jest.requireMock('../models');
      Order.findAndCountAll.mockResolvedValueOnce({
        count: 10,
        rows: [mockOrder],
      });

      const result = await PaymentService.getOrdersByBuyer('buyer-123', 1, 20);

      expect(result.total).toBe(10);
      expect(result.orders).toHaveLength(1);
      expect(Order.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { buyer_id: 'buyer-123' },
          limit: 20,
          offset: 0,
        })
      );
    });
  });

  describe('getOrderStatistics', () => {
    it('should return order statistics', async () => {
      const { Order } = jest.requireMock('../models');
      Order.count.mockResolvedValue(100);
      Order.sum.mockResolvedValue(9999.99);

      const stats = await PaymentService.getOrderStatistics();

      expect(stats.total_orders).toBe(100);
      expect(stats.total_revenue).toBe(9999.99);
      expect(Order.count).toHaveBeenCalled();
      expect(Order.sum).toHaveBeenCalled();
    });
  });
});
