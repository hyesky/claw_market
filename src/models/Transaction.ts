import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Wallet from './Wallet';
import Order from './Order';

interface TransactionAttributes {
  id: string;
  wallet_id: string;
  order_id?: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'commission' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'created_at' | 'status'> {}

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public wallet_id!: string;
  public order_id!: string;
  public amount!: number;
  public type!: 'deposit' | 'withdrawal' | 'commission' | 'refund';
  public status!: 'pending' | 'completed' | 'failed';
  public created_at!: Date;

  // Associations
  public wallet?: Wallet;
  public order?: Order;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Wallet,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Order,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdrawal', 'commission', 'refund'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default Transaction;
