import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Order from './Order';
import SoulProduct from './SoulProduct';

interface OrderItemAttributes {
  id: string;
  order_id: string;
  product_id: string;
  version_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Date;
}

interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, 'id' | 'created_at' | 'quantity'> {}

class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: string;
  public order_id!: string;
  public product_id!: string;
  public version_id!: string;
  public quantity!: number;
  public unit_price!: number;
  public total_price!: number;
  public created_at!: Date;

  // Associations
  public order?: Order;
  public product?: SoulProduct;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Order,
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
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default OrderItem;
