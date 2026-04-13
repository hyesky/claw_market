import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import SoulProduct from './SoulProduct';

interface SoulVersionAttributes {
  id: string;
  product_id: string;
  version: string;
  file_content: string;
  is_latest: boolean;
  created_at: Date;
}

interface SoulVersionCreationAttributes
  extends Optional<SoulVersionAttributes, 'id' | 'created_at' | 'is_latest'> {}

class SoulVersion
  extends Model<SoulVersionAttributes, SoulVersionCreationAttributes>
  implements SoulVersionAttributes
{
  public id!: string;
  public product_id!: string;
  public version!: string;
  public file_content!: string;
  public is_latest!: boolean;
  public created_at!: Date;

  // Associations
  public product?: SoulProduct;
}

SoulVersion.init(
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
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/,
      },
    },
    file_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_latest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'soul_versions',
    timestamps: false,
    createdAt: 'created_at',
  }
);

// Define associations
SoulVersion.belongsTo(SoulProduct, {
  foreignKey: 'product_id',
  as: 'product',
});

export default SoulVersion;
