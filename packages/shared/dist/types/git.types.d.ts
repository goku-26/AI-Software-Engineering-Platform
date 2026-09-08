export type GitBranchStatus = 'active' | 'merged' | 'stale' | 'deleted';
export type PullRequestStatus = 'open' | 'merged' | 'closed';
export type CDPipelineStatus = 'success' | 'pending' | 'running' | 'failed';
export interface IGitTaskBranch {
    id: string;
    name: string;
    baseBranch: string;
    commitMessage: string;
    modifiedFiles: string[];
    status: GitBranchStatus;
    author: string;
    createdAt: string;
    prUrl?: string;
    prNumber?: number;
}
export interface IPullRequest {
    prId: string;
    prNumber: number;
    title: string;
    body: string;
    sourceBranch: string;
    targetBranch: string;
    status: PullRequestStatus;
    htmlUrl: string;
    diffSummary: {
        filesChanged: number;
        additions: number;
        deletions: number;
    };
    createdAt: string;
}
export interface ICDWebhookTrigger {
    id: string;
    eventType: 'push' | 'pull_request' | 'deploy';
    branch: string;
    commitHash: string;
    commitMessage: string;
    status: CDPipelineStatus;
    buildDurationMs: number;
    deployedUrl?: string;
    environment: 'staging' | 'production' | 'preview';
    triggeredAt: string;
}
export interface CreateBranchDTO {
    name: string;
    baseBranch?: string;
    commitMessage?: string;
    modifiedFiles?: string[];
}
export interface CreatePullRequestDTO {
    title: string;
    body: string;
    sourceBranch: string;
    targetBranch?: string;
}
export interface TriggerPipelineDTO {
    branch?: string;
    commitHash?: string;
    environment?: 'staging' | 'production' | 'preview';
}
