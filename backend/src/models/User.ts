import bcrypt from "bcryptjs";
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
