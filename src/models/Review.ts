import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import SoulProduct from './SoulProduct';

interface ReviewAttributes {
  id: string;
  product_id: string;
  buyer_id: string;
  rating: number;
  comment?: string;
  images?: string;
  created_at: Date;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, 'id' | 'created_at'> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: string;
  public product_id!: string;
  public buyer_id!: string;
  public rating!: number;
  public comment!: string;
  public images!: string;
  public created_at!: Date;

  // Associations
  public buyer?: User;
  public product?: SoulProduct;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SoulProduct,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default Review;
