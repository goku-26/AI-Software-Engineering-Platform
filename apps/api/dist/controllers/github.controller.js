"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRepository = exports.listRepositories = exports.handleCallback = exports.getAuthUrl = void 0;
const github_service_1 = require("../services/github.service");
const user_model_1 = require("../models/user.model");
const project_model_1 = require("../models/project.model");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const getAuthUrl = async (req, res, next) => {
    try {
        const clientId = process.env.GITHUB_CLIENT_ID || 'demo_client_id';
        const callbackUrl = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/github/callback';
        const url = github_service_1.githubService.getAuthUrl(clientId, callbackUrl);
        (0, response_formatter_1.sendSuccess)(res, { url });
    }
    catch (error) {
        next(error);
    }
};
exports.getAuthUrl = getAuthUrl;
const handleCallback = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { code } = req.body;
        if (!code)
            throw api_error_1.ApiError.badRequest('Authorization code is required');
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            // Demo / Mock Fallback if environment variables are unconfigured
            const user = await user_model_1.User.findById(req.user.userId);
            if (user) {
                user.githubId = 'demo_github_123';
                user.githubUsername = 'devforge-demo-dev';
                user.githubAccessToken = 'demo_github_access_token';
                await user.save();
            }
            (0, response_formatter_1.sendSuccess)(res, { message: 'GitHub account connected in Demo Mode' });
            return;
        }
        const token = await github_service_1.githubService.exchangeCodeForToken(clientId, clientSecret, code);
        const ghUser = await github_service_1.githubService.getAuthenticatedUser(token);
        const user = await user_model_1.User.findById(req.user.userId);
        if (!user)
            throw api_error_1.ApiError.notFound('User not found');
        user.githubId = ghUser.id;
        user.githubUsername = ghUser.username;
        user.githubAccessToken = token;
        user.avatarUrl = user.avatarUrl || ghUser.avatarUrl;
        await user.save();
        (0, response_formatter_1.sendSuccess)(res, { message: 'GitHub account successfully connected', githubUsername: ghUser.username });
    }
    catch (error) {
        next(error);
    }
};
exports.handleCallback = handleCallback;
const listRepositories = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const user = await user_model_1.User.findById(req.user.userId).select('+githubAccessToken');
        if (!user || !user.githubAccessToken) {
            // Return sample public repositories for demonstration if GitHub is not connected
            (0, response_formatter_1.sendSuccess)(res, [
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
        const repos = await github_service_1.githubService.getUserRepos(user.githubAccessToken);
        (0, response_formatter_1.sendSuccess)(res, repos);
    }
    catch (error) {
        next(error);
    }
};
exports.listRepositories = listRepositories;
const importRepository = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { name, repositoryUrl, githubRepoId, githubFullName, isPrivateRepo, branch, framework, description } = req.body;
        if (!name || !repositoryUrl) {
            throw api_error_1.ApiError.badRequest('Project name and repository URL are required');
        }
        const project = new project_model_1.Project({
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
        (0, response_formatter_1.sendSuccess)(res, project.toDTO(), 201);
    }
    catch (error) {
        next(error);
    }
};
exports.importRepository = importRepository;
