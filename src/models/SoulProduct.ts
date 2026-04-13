import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface SoulProductAttributes {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description?: string;
  agent_type?: string;
  model_compatibility?: string;
  personality_tags?: string;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'archived' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

interface SoulProductCreationAttributes
  extends Optional<SoulProductAttributes, 'id' | 'created_at' | 'updated_at' | 'status'> {}

class SoulProduct
  extends Model<SoulProductAttributes, SoulProductCreationAttributes>
  implements SoulProductAttributes
{
  public id!: string;
  public creator_id!: string;
  public title!: string;
  public slug!: string;
  public description!: string;
  public agent_type!: string;
  public model_compatibility!: string;
  public personality_tags!: string;
  public price!: number;
  public currency!: string;
  public status!: 'draft' | 'published' | 'archived' | 'rejected';
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public creator?: User;
  public versions?: any[];
}

SoulProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9][a-z0-9-]*$/,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    agent_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    model_compatibility: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    personality_tags: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'CNY',
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived', 'rejected'),
      allowNull: false,
      defaultValue: 'draft',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'soul_products',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

// Define associations
SoulProduct.belongsTo(User, {
  foreignKey: 'creator_id',
  as: 'creator',
});

export default SoulProduct;

// Initialize association with SoulVersion after it's loaded
export function initSoulProductAssociations(): void {
  const SoulVersion = require('./SoulVersion').default;
  SoulProduct.hasMany(SoulVersion, {
    foreignKey: 'product_id',
    as: 'versions',
  });
}
