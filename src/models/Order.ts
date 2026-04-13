import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import SoulProduct from './SoulProduct';
import SoulVersion from './SoulVersion';

interface OrderAttributes {
  id: string;
  buyer_id: string;
  product_id: string;
  version_id?: string;
  price: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  authorization_type?: string;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'payment_status'> {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public buyer_id!: string;
  public product_id!: string;
  public version_id!: string;
  public price!: number;
  public currency!: string;
  public payment_status!: 'pending' | 'paid' | 'failed' | 'refunded';
  public payment_method!: string;
  public authorization_type!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public completed_at!: Date;

  // Associations
  public buyer?: User;
  public product?: SoulProduct;
  public version?: SoulVersion;
  public items?: any[];
  public authorizations?: any[];
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SoulProduct,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    version_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: SoulVersion,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'CNY',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    authorization_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

// Define associations
Order.belongsTo(User, {
  foreignKey: 'buyer_id',
  as: 'buyer',
});

Order.belongsTo(SoulProduct, {
  foreignKey: 'product_id',
  as: 'product',
});

Order.belongsTo(SoulVersion, {
  foreignKey: 'version_id',
  as: 'version',
});

export default Order;
