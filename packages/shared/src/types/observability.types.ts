export type LLMModelProvider = 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro' | 'local-demo';

export interface IAITokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface IAIToolCallLog {
  id: string;
  taskId: string;
  agentRole: 'architect' | 'coder' | 'reviewer' | 'debugger';
  toolName: string;
  argumentsSnippet: string;
  status: 'success' | 'failed' | 'running';
  executionTimeMs: number;
  timestamp: string;
}

export interface IModelProviderStat {
  provider: LLMModelProvider;
  name: string;
  tokensConsumed: number;
  costUsd: number;
  callCount: number;
}

export interface IAgentRoleStat {
  role: 'architect' | 'coder' | 'reviewer' | 'debugger';
  label: string;
  taskCount: number;
  successRate: number; // 0-100%
  avgTokensPerTask: number;
  avgLatencyMs: number;
}

export interface IAIObservabilityReport {
  reportId: string;
  projectId: string;
  totalTasksExecuted: number;
  totalTokensConsumed: number;
  totalCostUsd: number;
  averageLatencyMs: number;
  benchmarkScore: number; // 0-100% Quality Score
  modelProviderStats: IModelProviderStat[];
  agentRoleStats: IAgentRoleStat[];
  toolCallLogs: IAIToolCallLog[];
  evaluatedAt: string;
}

export interface FilterLogsDTO {
  agentRole?: string;
  status?: string;
}

export interface RunBenchmarkDTO {
  testSuiteScope?: 'all' | 'critical' | 'auth';
}
