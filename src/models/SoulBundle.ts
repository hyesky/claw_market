import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import SoulProduct from './SoulProduct';
import SoulVersion from './SoulVersion';

interface SoulBundleAttributes {
  id: string;
  product_id: string;
  version_id: string;
  file_name: string;
  file_type: string;
  file_content: string;
  created_at: Date;
}

interface SoulBundleCreationAttributes
  extends Optional<SoulBundleAttributes, 'id' | 'created_at'> {}

class SoulBundle
  extends Model<SoulBundleAttributes, SoulBundleCreationAttributes>
  implements SoulBundleAttributes
{
  public id!: string;
  public product_id!: string;
  public version_id!: string;
  public file_name!: string;
  public file_type!: string;
  public file_content!: string;
  public created_at!: Date;

  // Associations
  public product?: SoulProduct;
  public version?: SoulVersion;
}

SoulBundle.init(
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
    version_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SoulVersion,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_type: {
      type: DataTypes.ENUM('SOUL.md', 'AGENTS.md', 'USER.md'),
      allowNull: false,
    },
    file_content: {
      type: DataTypes.TEXT,
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
    tableName: 'soul_bundles',
    timestamps: false,
    createdAt: 'created_at',
  }
);

// Define associations
SoulBundle.belongsTo(SoulProduct, {
  foreignKey: 'product_id',
  as: 'product',
});

SoulBundle.belongsTo(SoulVersion, {
  foreignKey: 'version_id',
  as: 'version',
});

export default SoulBundle;
