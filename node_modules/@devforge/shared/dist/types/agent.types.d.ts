export type AgentRole = 'architect' | 'coder' | 'reviewer' | 'debugger';
export type AgentTaskStatus = 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export interface IAgentStep {
    id: string;
    role: AgentRole;
    title: string;
    detail: string;
    status: StepStatus;
    codePatch?: {
        filePath: string;
        description: string;
        originalContent?: string;
        newContent: string;
    };
    timestamp: string;
}
export interface IAgentTask {
    id: string;
    projectId: string;
    prompt: string;
    role: AgentRole;
    status: AgentTaskStatus;
    targetFiles: string[];
    steps: IAgentStep[];
    generatedPatch?: {
        filePath: string;
        description: string;
        originalContent?: string;
        newContent: string;
    };
    isApplied?: boolean;
    appliedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ExecuteAgentTaskDTO {
    prompt: string;
    role?: AgentRole;
    targetFiles?: string[];
    modelProvider?: string;
}
