import sequelize from '../config/database';
import User from './User';
import UserSession from './UserSession';
import SoulProduct from './SoulProduct';
import SoulVersion from './SoulVersion';
import SoulBundle from './SoulBundle';
import Order from './Order';
import OrderItem from './OrderItem';
import AuthorizationRecord from './AuthorizationRecord';
import Review from './Review';
import AuditLog from './AuditLog';
import ContentModeration from './ContentModeration';
import Wallet from './Wallet';
import Transaction from './Transaction';
import WithdrawalRequest from './WithdrawalRequest';

// Export models
export {
  User,
  UserSession,
  SoulProduct,
  SoulVersion,
  SoulBundle,
  Order,
  OrderItem,
  AuthorizationRecord,
  Review,
  AuditLog,
  ContentModeration,
  Wallet,
  Transaction,
  WithdrawalRequest,
};

// Export sequelize instance
export default sequelize;

// Test connection
export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
}
