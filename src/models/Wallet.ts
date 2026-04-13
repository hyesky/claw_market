import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface WalletAttributes {
  id: string;
  creator_id: string;
  balance: number;
  currency: string;
  pending_withdrawal: number;
  created_at: Date;
}

interface WalletCreationAttributes
  extends Optional<WalletAttributes, 'id' | 'created_at' | 'balance' | 'pending_withdrawal' | 'currency'> {}

class Wallet
  extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes
{
  public id!: string;
  public creator_id!: string;
  public balance!: number;
  public currency!: string;
  public pending_withdrawal!: number;
  public created_at!: Date;

  // Associations
  public creator?: User;
}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'CNY',
    },
    pending_withdrawal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'wallets',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default Wallet;
