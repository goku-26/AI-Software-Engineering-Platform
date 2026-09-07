export type ProjectStatus = 'active' | 'archived' | 'indexing' | 'error';
export type FrameworkType = 'react' | 'express' | 'nextjs' | 'node' | 'python' | 'unknown';

export interface IProject {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: ProjectStatus;
  framework: FrameworkType;
  repositoryUrl?: string;
  githubRepoId?: string;
  githubFullName?: string;
  isPrivateRepo?: boolean;
  branch?: string;
  isIndexed: boolean;
  indexedAt?: string;
  fileCount: number;
  testHealthScore: number;
  securityScore: number;
  codeQualityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  repositoryUrl?: string;
  githubRepoId?: string;
  githubFullName?: string;
  isPrivateRepo?: boolean;
  branch?: string;
  framework?: FrameworkType;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  repositoryUrl?: string;
  branch?: string;
  status?: ProjectStatus;
}
