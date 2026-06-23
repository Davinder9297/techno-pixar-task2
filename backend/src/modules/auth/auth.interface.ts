import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  isActive: boolean;
  comparePassword(password: string): Promise<boolean>;
}
export interface ResetPassword extends Document {
userId: any;
resetPasswordToken: string;
otp: string;
expiresAt: Date;
}
