import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class OrderController {
  // Create order
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { product_id, version_id, price, currency, authorization_type } = req.body;

      const order = await PaymentService.createOrder(
        req.user!.id,
        product_id,
        version_id,
        price,
        currency,
        authorization_type
      );

      res.status(201).json({
        success: true,
        data: { order },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Process payment
  static async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { payment_method, payment_data } = req.body;

      const order = await PaymentService.processPayment(id, payment_method, payment_data);

      res.json({
        success: true,
        data: { order },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get order
  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await PaymentService.getOrderById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.json({
        success: true,
        data: { order },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // List orders
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;

      const { orders, total } = await PaymentService.getOrdersByBuyer(
        req.user!.id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );

      res.json({
        success: true,
        data: {
          orders,
          total,
          page: parseInt(page as string) || 1,
          limit: parseInt(limit as string) || 20,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Refund order
  static async refund(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await PaymentService.refundOrder(id);

      res.json({
        success: true,
        data: { order },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get order statistics (admin only)
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await PaymentService.getOrderStatistics();

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
