import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  isActive: boolean;
  comparePassword(password: string): Promise<boolean>;
}
