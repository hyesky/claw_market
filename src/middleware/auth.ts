import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { AuthService } from '../services/AuthService';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as 'buyer' | 'creator' | 'admin',
    };
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
}

export function requireRole(
  ...roles: Array<'buyer' | 'creator' | 'admin'>
): (req: Request, _res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role as 'buyer' | 'creator' | 'admin')) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
}

export function requireCreator(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== 'creator') {
    throw new AppError('Creator role required', 403);
  }

  next();
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Admin role required', 403);
  }

  next();
}
