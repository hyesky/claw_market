import { Wallet, Transaction, WithdrawalRequest, User, Order, SoulProduct } from '../models';
import AuditLog from '../models/AuditLog';

const PLATFORM_COMMISSION_PERCENT = Number(process.env.PLATFORM_COMMISSION_PERCENT) || 10;
const MIN_WITHDRAWAL_THRESHOLD = 100; // Minimum withdrawal amount

export class PayoutService {
  // Get or create wallet for creator
  static async getOrCreateWallet(creator_id: string): Promise<Wallet> {
    let wallet = await Wallet.findOne({ where: { creator_id } });

    if (!wallet) {
      wallet = await Wallet.create({
        creator_id,
        balance: 0,
        currency: 'CNY',
        pending_withdrawal: 0,
      });
    }

    return wallet;
  }

  // Split revenue from order
  static async splitRevenue(order_id: string): Promise<{
    platformCommission: number;
    creatorEarnings: number;
  }> {
    const order = await Order.findByPk(order_id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.payment_status !== 'paid') {
      throw new Error('Order has not been paid');
    }

    // Get product to find creator
    const product = await SoulProduct.findByPk(order.product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    const totalAmount = Number(order.price);
    const platformCommission = totalAmount * (PLATFORM_COMMISSION_PERCENT / 100);
    const creatorEarnings = totalAmount - platformCommission;

    // Get or create creator's wallet
    const wallet = await this.getOrCreateWallet(product.creator_id);

    // Add earnings to wallet
    const newBalance = Number(wallet.balance) + creatorEarnings;
    await wallet.update({ balance: newBalance });

    // Record deposit transaction
    await Transaction.create({
      wallet_id: wallet.id,
      order_id: order.id,
      amount: creatorEarnings,
      type: 'deposit',
      status: 'completed',
    });

    // Record platform commission
    await Transaction.create({
      wallet_id: wallet.id,
      order_id: order.id,
      amount: platformCommission,
      type: 'commission',
      status: 'completed',
    });

    // Log action
    await AuditLog.create({
      action: 'revenue_split',
      target_type: 'order',
      target_id: order.id,
      details: {
        order_id: order.id,
        total_amount: totalAmount,
        platform_commission: platformCommission,
        creator_earnings: creatorEarnings,
      },
    });

    return { platformCommission, creatorEarnings };
  }

  // Process withdrawal request
  static async processWithdrawal(
    wallet_id: string,
    amount: number,
    bank_account?: string,
    crypto_wallet?: string
  ): Promise<WithdrawalRequest> {
    const wallet = await Wallet.findByPk(wallet_id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check minimum withdrawal threshold
    if (amount < MIN_WITHDRAWAL_THRESHOLD) {
      throw new Error(`Minimum withdrawal amount is ${MIN_WITHDRAWAL_THRESHOLD}`);
    }

    // Check sufficient balance
    const availableBalance = Number(wallet.balance) - Number(wallet.pending_withdrawal);
    if (amount > availableBalance) {
      throw new Error('Insufficient balance');
    }

    // Validate payment method
    if (!bank_account && !crypto_wallet) {
      throw new Error('Bank account or crypto wallet is required');
    }

    // Create withdrawal request
    const withdrawal = await WithdrawalRequest.create({
      wallet_id,
      amount,
      bank_account,
      crypto_wallet,
      status: 'pending',
    });

    // Update pending withdrawal
    const newPending = Number(wallet.pending_withdrawal) + amount;
    await wallet.update({ pending_withdrawal: newPending });

    // Record withdrawal transaction
    await Transaction.create({
      wallet_id,
      amount,
      type: 'withdrawal',
      status: 'pending',
    });

    // Log action
    await AuditLog.create({
      action: 'withdrawal_requested',
      user_id: wallet.creator_id,
      target_type: 'wallet',
      target_id: wallet_id,
      details: {
        amount,
        withdrawal_id: withdrawal.id,
        payment_method: bank_account ? 'bank' : 'crypto',
      },
    });

    return withdrawal;
  }

  // Approve withdrawal request
  static async approveWithdrawal(
    withdrawal_id: string,
    processor_id: string
  ): Promise<WithdrawalRequest> {
    const withdrawal = await WithdrawalRequest.findByPk(withdrawal_id);
    if (!withdrawal) {
      throw new Error('Withdrawal request not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Withdrawal is not pending');
    }

    // Update status
    withdrawal.status = 'processing';
    withdrawal.processed_at = new Date();
    await withdrawal.save();

    // Update wallet
    const wallet = await Wallet.findByPk(withdrawal.wallet_id);
    if (wallet) {
      const newBalance = Number(wallet.balance) - Number(withdrawal.amount);
      const newPending = Number(wallet.pending_withdrawal) - Number(withdrawal.amount);
      await wallet.update({
        balance: newBalance,
        pending_withdrawal: Math.max(0, newPending),
      });

      // Update transaction status
      await Transaction.update(
        { status: 'completed' },
        { where: { type: 'withdrawal', status: 'pending', wallet_id: wallet.id } }
      );
    }

    // Log action
    await AuditLog.create({
      action: 'withdrawal_approved',
      user_id: processor_id,
      target_type: 'withdrawal',
      target_id: withdrawal_id,
      details: { amount: Number(withdrawal.amount) },
    });

    return withdrawal;
  }

  // Reject withdrawal request
  static async rejectWithdrawal(
    withdrawal_id: string,
    processor_id: string,
    reason: string
  ): Promise<WithdrawalRequest> {
    const withdrawal = await WithdrawalRequest.findByPk(withdrawal_id);
    if (!withdrawal) {
      throw new Error('Withdrawal request not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Withdrawal is not pending');
    }

    // Update status
    withdrawal.status = 'rejected';
    withdrawal.processed_at = new Date();
    await withdrawal.save();

    // Update wallet - restore pending withdrawal
    const wallet = await Wallet.findByPk(withdrawal.wallet_id);
    if (wallet) {
      const newPending = Number(wallet.pending_withdrawal) - Number(withdrawal.amount);
      await wallet.update({ pending_withdrawal: Math.max(0, newPending) });

      // Update transaction status
      await Transaction.update(
        { status: 'failed' },
        { where: { type: 'withdrawal', status: 'pending', wallet_id: wallet.id } }
      );
    }

    // Log action
    await AuditLog.create({
      action: 'withdrawal_rejected',
      user_id: processor_id,
      target_type: 'withdrawal',
      target_id: withdrawal_id,
      details: { reason, amount: Number(withdrawal.amount) },
    });

    return withdrawal;
  }

  // Generate monthly statement for creator
  static async generateStatement(
    creator_id: string,
    month: number,
    year: number
  ): Promise<{
    totalEarnings: number;
    totalCommission: number;
    totalWithdrawals: number;
    currentBalance: number;
    transactions: Transaction[];
  }> {
    const wallet = await Wallet.findOne({ where: { creator_id } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const transactions = await Transaction.findAll({
      where: {
        wallet_id: wallet.id,
        created_at: {
         gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const totalEarnings = transactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalCommission = transactions
      .filter((t) => t.type === 'commission')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalEarnings,
      totalCommission,
      totalWithdrawals,
      currentBalance: Number(wallet.balance),
      transactions,
    };
  }

  // Get wallet balance
  static async getWalletBalance(creator_id: string): Promise<{
    balance: number;
    pendingWithdrawal: number;
    currency: string;
  }> {
    const wallet = await Wallet.findOne({ where: { creator_id } });
    if (!wallet) {
      return { balance: 0, pendingWithdrawal: 0, currency: 'CNY' };
    }

    return {
      balance: Number(wallet.balance),
      pendingWithdrawal: Number(wallet.pending_withdrawal),
      currency: wallet.currency,
    };
  }
}
