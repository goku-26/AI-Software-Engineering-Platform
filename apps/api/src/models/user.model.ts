import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  githubId?: string;
  githubUsername?: string;
  githubAccessToken?: string;
  avatarUrl?: string;
  comparePassword(password: string): Promise<boolean>;
  toDTO(): any;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    githubId: {
      type: String,
      sparse: true,
    },
    githubUsername: {
      type: String,
      sparse: true,
    },
    githubAccessToken: {
      type: String,
      select: false,
    },
    avatarUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    name: this.name,
    role: this.role,
    githubId: this.githubId,
    githubUsername: this.githubUsername,
    avatarUrl: this.avatarUrl,
    isGithubConnected: Boolean(this.githubAccessToken || this.githubId),
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString(),
  };
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
