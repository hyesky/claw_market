import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: string;
  email: string;
  phone?: string;
  password_hash: string;
  role: 'buyer' | 'creator' | 'admin';
  real_name?: string;
  openclaw_workspace_id?: string;
  status: 'active' | 'suspended' | 'banned';
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'status'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public phone!: string;
  public password_hash!: string;
  public role!: 'buyer' | 'creator' | 'admin';
  public real_name!: string;
  public openclaw_workspace_id!: string;
  public status!: 'active' | 'suspended' | 'banned';
  public created_at!: Date;
  public updated_at!: Date;

  // Associations (declared with 'any' to avoid circular dependency issues)
  public sessions?: any[];
  public orders?: any[];
  public products?: any[];
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('buyer', 'creator', 'admin'),
      allowNull: false,
      defaultValue: 'buyer',
    },
    real_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    openclaw_workspace_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'banned'),
      allowNull: false,
      defaultValue: 'active',
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
    tableName: 'users',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

export default User;

// Initialize associations (must be called after all models are loaded)
export function initUserAssociations(): void {
  const UserSession = require('./UserSession').default;
  const Order = require('./Order').default;
  const SoulProduct = require('./SoulProduct').default;

  User.hasMany(UserSession, {
    foreignKey: 'user_id',
    as: 'sessions',
  });

  User.hasMany(Order, {
    foreignKey: 'buyer_id',
    as: 'orders',
  });

  User.hasMany(SoulProduct, {
    foreignKey: 'creator_id',
    as: 'products',
  });
}
