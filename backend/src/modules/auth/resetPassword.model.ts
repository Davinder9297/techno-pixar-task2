import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { ResetPassword } from './auth.interface';

const resetPasswordSchema = new Schema<ResetPassword>(
  {
   userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
   resetPasswordToken: { type: String, required: true },
   otp: { type: String, required: true },
   expiresAt: { type: Date, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model<ResetPassword>('ResetPassword', resetPasswordSchema);
