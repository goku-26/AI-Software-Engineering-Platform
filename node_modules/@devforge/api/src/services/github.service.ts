import axios from 'axios';
import { ApiError } from '../utils/api-error';

export interface GithubRepoItem {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  htmlUrl: string;
  defaultBranch: string;
  language: string | null;
  updatedAt: string;
}

export const githubService = {
  getAuthUrl: (clientId: string, redirectUri: string): string => {
    const scope = 'read:user,repo';
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
  },

  exchangeCodeForToken: async (
    clientId: string,
    clientSecret: string,
    code: string
  ): Promise<string> => {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.data.error || !response.data.access_token) {
        throw ApiError.badRequest(
          response.data.error_description || 'Failed to exchange GitHub authorization code',
          'GITHUB_OAUTH_ERROR'
        );
      }

      return response.data.access_token;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw ApiError.badRequest(`GitHub OAuth failed: ${err.message}`, 'GITHUB_OAUTH_ERROR');
    }
  },

  getAuthenticatedUser: async (accessToken: string) => {
    try {
      const res = await axios.get('https://api.github.com/user', {
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
    } catch (err: any) {
      throw ApiError.badRequest('Failed to fetch GitHub user details');
    }
  },

  getUserRepos: async (accessToken: string): Promise<GithubRepoItem[]> => {
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          sort: 'updated',
          per_page: 50,
        },
      });

      return response.data.map((repo: any) => ({
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
    } catch (err: any) {
      throw ApiError.badRequest(`Failed to fetch GitHub repositories: ${err.message}`);
    }
  },
};
