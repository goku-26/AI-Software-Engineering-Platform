"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubService = void 0;
const axios_1 = __importDefault(require("axios"));
const api_error_1 = require("../utils/api-error");
exports.githubService = {
    getAuthUrl: (clientId, redirectUri) => {
        const scope = 'read:user,repo';
        return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    },
    exchangeCodeForToken: async (clientId, clientSecret, code) => {
        try {
            const response = await axios_1.default.post('https://github.com/login/oauth/access_token', {
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }, {
                headers: {
                    Accept: 'application/json',
                },
            });
            if (response.data.error || !response.data.access_token) {
                throw api_error_1.ApiError.badRequest(response.data.error_description || 'Failed to exchange GitHub authorization code', 'GITHUB_OAUTH_ERROR');
            }
            return response.data.access_token;
        }
        catch (err) {
            if (err instanceof api_error_1.ApiError)
                throw err;
            throw api_error_1.ApiError.badRequest(`GitHub OAuth failed: ${err.message}`, 'GITHUB_OAUTH_ERROR');
        }
    },
    getAuthenticatedUser: async (accessToken) => {
        try {
            const res = await axios_1.default.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            return {
                id: res.data.id.toString(),
                username: res.data.login,
                avatarUrl: res.data.avatar_url,
            };
        }
        catch (err) {
            throw api_error_1.ApiError.badRequest('Failed to fetch GitHub user details');
        }
    },
    getUserRepos: async (accessToken) => {
        try {
            const response = await axios_1.default.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                params: {
                    sort: 'updated',
                    per_page: 50,
                },
            });
            return response.data.map((repo) => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                private: repo.private,
                htmlUrl: repo.html_url,
                defaultBranch: repo.default_branch || 'main',
                language: repo.language,
                updatedAt: repo.updated_at,
            }));
        }
        catch (err) {
            throw api_error_1.ApiError.badRequest(`Failed to fetch GitHub repositories: ${err.message}`);
        }
    },
};
