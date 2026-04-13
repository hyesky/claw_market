import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface UserSessionAttributes {
  id: string;
  user_id: string;
  token: string;
  refresh_token?: string;
  expires_at: Date;
  created_at: Date;
}

interface UserSessionCreationAttributes
  extends Optional<UserSessionAttributes, 'id' | 'created_at'> {}

class UserSession
  extends Model<UserSessionAttributes, UserSessionCreationAttributes>
  implements UserSessionAttributes
{
  public id!: string;
  public user_id!: string;
  public token!: string;
  public refresh_token!: string;
  public expires_at!: Date;
  public created_at!: Date;

  // Associations
  public user?: User;
}

UserSession.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
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
    tableName: 'user_sessions',
    timestamps: false,
    createdAt: 'created_at',
  }
);

// Define associations
UserSession.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(UserSession, {
  foreignKey: 'user_id',
  as: 'sessions',
});

export default UserSession;
