import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseService } from '../services/response.service';
import User from '../modules/auth/auth.model';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ResponseService.error(res, 'Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user) {
      return ResponseService.error(res, 'The user belonging to this token no longer exists', 401);
    }

    if (!user.isActive) {
      return ResponseService.error(res, 'Your account has been deactivated by an admin', 403);
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    return ResponseService.error(res, 'Not authorized to access this route', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return ResponseService.error(res, `User role ${(req as any).user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};
