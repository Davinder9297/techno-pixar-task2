import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ResponseService } from '../../services/response.service';
import { validateEmail, validatePassword } from '../../utils/validation.util';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return ResponseService.error(res, 'Please provide all required fields', 400);
      }

      if (!validateEmail(email)) {
        return ResponseService.error(res, 'Please provide a valid email address', 400);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return ResponseService.error(res, passwordValidation.message, 400);
      }

      const existingUser = await AuthService.findByEmail(email);
      if (existingUser) {
        return ResponseService.error(res, 'Email already exists', 400);
      }

      const user = await AuthService.register({ name, email, password, role });
      const token = AuthService.generateToken(user);

      ResponseService.success(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ResponseService.error(res, 'Please provide email and password', 400);
      }

      const user = await AuthService.findByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        return ResponseService.error(res, 'Invalid credentials', 401);
      }

      if (!user.isActive) {
        return ResponseService.error(res, 'Your account has been deactivated by an admin', 403);
      }

      const token = AuthService.generateToken(user);

      ResponseService.success(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.findById((req as any).user.id);
      if (!user) {
        return ResponseService.error(res, 'User not found', 404);
      }
      ResponseService.success(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.getAllUsers(req.query);
      ResponseService.success(res, data, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await AuthService.toggleStatus(id);
      if (!user) {
        return ResponseService.error(res, 'User not found', 404);
      }
      ResponseService.success(res, user, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
