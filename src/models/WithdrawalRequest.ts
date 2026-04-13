import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Wallet from './Wallet';

interface WithdrawalRequestAttributes {
  id: string;
  wallet_id: string;
  amount: number;
  bank_account?: string;
  crypto_wallet?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: Date;
  processed_at?: Date;
}

interface WithdrawalRequestCreationAttributes
  extends Optional<WithdrawalRequestAttributes, 'id' | 'created_at' | 'processed_at' | 'status'> {}

class WithdrawalRequest
  extends Model<WithdrawalRequestAttributes, WithdrawalRequestCreationAttributes>
  implements WithdrawalRequestAttributes
{
  public id!: string;
  public wallet_id!: string;
  public amount!: number;
  public bank_account!: string;
  public crypto_wallet!: string;
  public status!: 'pending' | 'processing' | 'completed' | 'rejected';
  public created_at!: Date;
  public processed_at!: Date;

  // Associations
  public wallet?: Wallet;
}

WithdrawalRequest.init(
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
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    bank_account: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    crypto_wallet: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'withdrawal_requests',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default WithdrawalRequest;