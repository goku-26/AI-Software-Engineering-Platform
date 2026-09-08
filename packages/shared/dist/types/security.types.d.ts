export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type VulnerabilityCategory = 'auth' | 'injection' | 'secret' | 'config' | 'sanitization';
export type VulnerabilityStatus = 'open' | 'remediated' | 'ignored';
export interface ISecurityVulnerability {
    id: string;
    cweId: string;
    title: string;
    description: string;
    severity: VulnerabilitySeverity;
    category: VulnerabilityCategory;
    filePath: string;
    lineNumber: number;
    snippet: string;
    recommendation: string;
    status: VulnerabilityStatus;
}
export interface ISecurityScanReport {
    scanId: string;
    projectId: string;
    totalVulnerabilities: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    securityScore: number;
    scannedFilesCount: number;
    vulnerabilities: ISecurityVulnerability[];
    scannedAt: string;
}
export interface AutoRemediateDTO {
    vulnerabilityId: string;
    filePath: string;
}
export interface ISecurityRemediationResult {
    vulnerabilityId: string;
    filePath: string;
    originalCode: string;
    remediatedCode: string;
    explanation: string;
}
