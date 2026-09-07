export type TestStatus = 'passed' | 'failed' | 'skipped' | 'running';
export interface ITestCase {
    id: string;
    name: string;
    suiteName: string;
    durationMs: number;
    status: TestStatus;
    errorMessage?: string;
    stackTrace?: string;
    codeSnippet?: string;
}
export interface ITestSuiteRun {
    runId: string;
    projectId: string;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    durationMs: number;
    healthScore: number;
    testCases: ITestCase[];
    executedAt: string;
}
export interface GenerateTestsDTO {
    filePath: string;
    testType?: 'unit' | 'integration' | 'edge_cases';
}
export interface SaveUnitTestDTO {
    filePath: string;
    testCode: string;
}
