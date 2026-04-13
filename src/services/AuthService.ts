import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, UserSession } from '../models';

const SALT_ROUNDS = 10;
const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-change-in-production';

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Compare password with hash
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Register new user
  static async register(
    email: string,
    password: string,
    phone?: string,
    real_name?: string
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or phone already exists');
    }

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      phone,
      password_hash,
      real_name,
      role: 'buyer',
      status: 'active',
    });

    return user;
  }

  // Login user
  static async login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await this.comparePassword(password, user.password_hash);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is not active');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save session
    await UserSession.create({
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return { accessToken, refreshToken, user };
  }

  // Login with phone
  static async loginWithPhone(
    phone: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    // Find user by phone
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      throw new Error('Invalid phone or password');
    }

    // Verify password
    const isValid = await this.comparePassword(password, user.password_hash);

    if (!isValid) {
      throw new Error('Invalid phone or password');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is not active');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save session
    await UserSession.create({
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Find valid session
    const session = await UserSession.findOne({
      where: {
        refresh_token: refreshToken,
        expires_at: { [Op.gt]: new Date() },
      },
      include: [{ model: User, as: 'user' }],
    });

    if (!session || !session.user) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const newAccessToken = this.generateAccessToken(session.user);
    const newRefreshToken = this.generateRefreshToken(session.user);

    // Update session
    session.token = newAccessToken;
    session.refresh_token = newRefreshToken;
    session.expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await session.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // Logout user
  static async logout(accessToken: string): Promise<void> {
    await UserSession.destroy({ where: { token: accessToken } });
  }

  // Generate access token
  private static generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: 86400 } // 24 hours in seconds
    );
  }

  // Generate refresh token
  private static generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: 604800 } // 7 days in seconds
    );
  }

  // Verify token
  static verifyToken(token: string): {
    userId: string;
    email: string;
    role: string;
  } {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
  }

  // Third-party login (OAuth)
  static async thirdPartyLogin(
    _provider: string,
    _providerId: string,
    email: string,
    name?: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
    isNewUser: boolean;
  }> {
    let isNewUser = false;
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user
      const password_hash = await this.hashPassword(
        Math.random().toString(36).slice(-20)
      );
      user = await User.create({
        email,
        password_hash,
        real_name: name,
        role: 'buyer',
        status: 'active',
      });
      isNewUser = true;
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save session
    await UserSession.create({
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user, isNewUser };
  }
}
