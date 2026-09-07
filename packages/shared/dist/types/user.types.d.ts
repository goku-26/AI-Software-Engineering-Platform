export interface IUser {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    githubId?: string;
    githubUsername?: string;
    avatarUrl?: string;
    isGithubConnected?: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}
export interface AuthResponse {
    user: IUser;
    tokens: AuthTokens;
}
export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}
export interface LoginDTO {
    email: string;
    password: string;
}
