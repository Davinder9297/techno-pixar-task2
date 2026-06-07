import User from './auth.model';
import { IUser } from './auth.interface';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async register(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  static async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  static async getAllUsers(query: any): Promise<{ users: IUser[]; total: number }> {
    const { search, status, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      filter.isActive = status === 'active';
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    const transformedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }));

    return { users: transformedUsers as any, total };
  }

  static async toggleStatus(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) return null;
    user.isActive = !user.isActive;
    return await user.save();
  }

  static generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
  }
}
