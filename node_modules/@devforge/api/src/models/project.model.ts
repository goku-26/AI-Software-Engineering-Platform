import mongoose, { Schema, Document } from 'mongoose';
import { ProjectStatus, FrameworkType } from '@devforge/shared';

export interface IProjectDocument extends Document {
  name: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  status: ProjectStatus;
  framework: FrameworkType;
  repositoryUrl?: string;
  githubRepoId?: string;
  githubFullName?: string;
  isPrivateRepo?: boolean;
  branch?: string;
  isIndexed: boolean;
  indexedAt?: Date;
  fileCount: number;
  testHealthScore: number;
  securityScore: number;
  codeQualityScore: number;
  toDTO(): any;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'indexing', 'error'],
      default: 'active',
    },
    framework: {
      type: String,
      enum: ['react', 'express', 'nextjs', 'node', 'python', 'unknown'],
      default: 'unknown',
    },
    repositoryUrl: {
      type: String,
      default: '',
    },
    githubRepoId: {
      type: String,
      default: '',
    },
    githubFullName: {
      type: String,
      default: '',
    },
    isPrivateRepo: {
      type: Boolean,
      default: false,
    },
    branch: {
      type: String,
      default: 'main',
    },
    isIndexed: {
      type: Boolean,
      default: false,
    },
    indexedAt: {
      type: Date,
    },
    fileCount: {
      type: Number,
      default: 0,
    },
    testHealthScore: {
      type: Number,
      default: 100,
    },
    securityScore: {
      type: Number,
      default: 100,
    },
    codeQualityScore: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ ownerId: 1, createdAt: -1 });

ProjectSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    ownerId: this.ownerId.toString(),
    status: this.status,
    framework: this.framework,
    repositoryUrl: this.repositoryUrl,
    githubRepoId: this.githubRepoId,
    githubFullName: this.githubFullName,
    isPrivateRepo: this.isPrivateRepo,
    branch: this.branch,
    isIndexed: this.isIndexed,
    indexedAt: this.indexedAt ? this.indexedAt.toISOString() : undefined,
    fileCount: this.fileCount,
    testHealthScore: this.testHealthScore,
    securityScore: this.securityScore,
    codeQualityScore: this.codeQualityScore,
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString(),
  };
};

export const Project = mongoose.model<IProjectDocument>('Project', ProjectSchema);
