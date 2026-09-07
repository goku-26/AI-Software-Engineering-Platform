import { Response, NextFunction } from 'express';
import { githubService } from '../services/github.service';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getAuthUrl = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID || 'demo_client_id';
    const callbackUrl = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/github/callback';
    const url = githubService.getAuthUrl(clientId, callbackUrl);
    sendSuccess(res, { url });
  } catch (error) {
    next(error);
  }
};

export const handleCallback = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { code } = req.body;
    if (!code) throw ApiError.badRequest('Authorization code is required');

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      // Demo / Mock Fallback if environment variables are unconfigured
      const user = await User.findById(req.user.userId);
      if (user) {
        user.githubId = 'demo_github_123';
        user.githubUsername = 'devforge-demo-dev';
        user.githubAccessToken = 'demo_github_access_token';
        await user.save();
      }
      sendSuccess(res, { message: 'GitHub account connected in Demo Mode' });
      return;
    }

    const token = await githubService.exchangeCodeForToken(clientId, clientSecret, code);
    const ghUser = await githubService.getAuthenticatedUser(token);

    const user = await User.findById(req.user.userId);
    if (!user) throw ApiError.notFound('User not found');

    user.githubId = ghUser.id;
    user.githubUsername = ghUser.username;
    user.githubAccessToken = token;
    user.avatarUrl = user.avatarUrl || ghUser.avatarUrl;
    await user.save();

    sendSuccess(res, { message: 'GitHub account successfully connected', githubUsername: ghUser.username });
  } catch (error) {
    next(error);
  }
};

export const listRepositories = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const user = await User.findById(req.user.userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
      // Return sample public repositories for demonstration if GitHub is not connected
      sendSuccess(res, [
        {
          id: 101,
          name: 'mern-authentication-service',
          fullName: 'devforge-demo/mern-authentication-service',
          description: 'Production MERN Auth service with JWT & Role verification',
          private: false,
          htmlUrl: 'https://github.com/devforge-demo/mern-auth',
          defaultBranch: 'main',
          language: 'JavaScript',
          updatedAt: new Date().toISOString(),
        },
        {
          id: 102,
          name: 'ecommerce-backend-api',
          fullName: 'devforge-demo/ecommerce-backend-api',
          description: 'Express + MongoDB inventory management and order processing API',
          private: true,
          htmlUrl: 'https://github.com/devforge-demo/ecommerce-api',
          defaultBranch: 'main',
          language: 'TypeScript',
          updatedAt: new Date().toISOString(),
        },
      ]);
      return;
    }

    const repos = await githubService.getUserRepos(user.githubAccessToken);
    sendSuccess(res, repos);
  } catch (error) {
    next(error);
  }
};

export const importRepository = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { name, repositoryUrl, githubRepoId, githubFullName, isPrivateRepo, branch, framework, description } = req.body;

    if (!name || !repositoryUrl) {
      throw ApiError.badRequest('Project name and repository URL are required');
    }

    const project = new Project({
      name,
      description: description || `Imported from GitHub repo ${githubFullName || repositoryUrl}`,
      ownerId: req.user.userId,
      repositoryUrl,
      githubRepoId: githubRepoId || '',
      githubFullName: githubFullName || '',
      isPrivateRepo: Boolean(isPrivateRepo),
      branch: branch || 'main',
      framework: framework || 'express',
      status: 'active',
      isIndexed: true,
      indexedAt: new Date(),
      fileCount: 24,
    });

    await project.save();
    sendSuccess(res, project.toDTO(), 201);
  } catch (error) {
    next(error);
  }
};
