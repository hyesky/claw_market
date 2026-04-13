import { Request, Response } from 'express';
import { PayoutService } from '../services/PayoutService';

export class PayoutController {
  // Get wallet balance
  static async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const balance = await PayoutService.getWalletBalance(req.user!.id);

      res.json({
        success: true,
        data: { balance },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Request withdrawal
  static async requestWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const { amount, bank_account, crypto_wallet } = req.body;

      const wallet = await PayoutService.getOrCreateWallet(req.user!.id);
      const withdrawal = await PayoutService.processWithdrawal(
        wallet.id,
        amount,
        bank_account,
        crypto_wallet
      );

      res.status(201).json({
        success: true,
        data: { withdrawal },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get withdrawal history
  static async getWithdrawals(req: Request, res: Response): Promise<void> {
    try {
      const wallet = await PayoutService.getOrCreateWallet(req.user!.id);

      const withdrawals = await require('../models').WithdrawalRequest.findAll({
        where: { wallet_id: wallet.id },
        order: [['created_at', 'DESC']],
      });

      res.json({
        success: true,
        data: { withdrawals },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get monthly statement
  static async getStatement(req: Request, res: Response): Promise<void> {
    try {
      const { month, year } = req.query;

      const statement = await PayoutService.generateStatement(
        req.user!.id,
        parseInt(month as string),
        parseInt(year as string)
      );

      res.json({
        success: true,
        data: { statement },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Admin: Approve withdrawal
  static async approveWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const withdrawal = await PayoutService.approveWithdrawal(id, req.user!.id);

      res.json({
        success: true,
        data: { withdrawal },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Admin: Reject withdrawal
  static async rejectWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const withdrawal = await PayoutService.rejectWithdrawal(id, req.user!.id, reason);

      res.json({
        success: true,
        data: { withdrawal },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
