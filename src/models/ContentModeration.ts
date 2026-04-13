import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import SoulProduct from './SoulProduct';
import SoulVersion from './SoulVersion';

interface ContentModerationAttributes {
  id: string;
  product_id?: string;
  version_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reason?: string;
  moderator_id?: string;
  created_at: Date;
}

interface ContentModerationCreationAttributes
  extends Optional<ContentModerationAttributes, 'id' | 'created_at' | 'status'> {}

class ContentModeration
  extends Model<ContentModerationAttributes, ContentModerationCreationAttributes>
  implements ContentModerationAttributes
{
  public id!: string;
  public product_id!: string;
  public version_id!: string;
  public status!: 'pending' | 'approved' | 'rejected' | 'flagged';
  public reason!: string;
  public moderator_id!: string;
  public created_at!: Date;

  // Associations
  public product?: SoulProduct;
  public version?: SoulVersion;
  public moderator?: User;
}

ContentModeration.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: SoulProduct,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    version_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: SoulVersion,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged'),
      allowNull: false,
      defaultValue: 'pending',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    moderator_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'content_moderation',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default ContentModeration;
