import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Order from './Order';

interface AuthorizationRecordAttributes {
  id: string;
  order_id: string;
  workspace_id: string;
  authorization_scope: string;
  expires_at?: Date;
  created_at: Date;
}

interface AuthorizationRecordCreationAttributes
  extends Optional<AuthorizationRecordAttributes, 'id' | 'created_at'> {}

class AuthorizationRecord
  extends Model<AuthorizationRecordAttributes, AuthorizationRecordCreationAttributes>
  implements AuthorizationRecordAttributes
{
  public id!: string;
  public order_id!: string;
  public workspace_id!: string;
  public authorization_scope!: string;
  public expires_at!: Date;
  public created_at!: Date;

  // Associations
  public order?: Order;
}

AuthorizationRecord.init(
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
    workspace_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    authorization_scope: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: [['personal', 'commercial', 'enterprise']],
      },
    },
    expires_at: {
      type: DataTypes.DATE,
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
    tableName: 'authorization_records',
    timestamps: false,
    createdAt: 'created_at',
  }
);

export default AuthorizationRecord;
