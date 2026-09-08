export type DependencyType = 'internal_monorepo' | 'npm_package' | 'microservice_api' | 'peer_dependency';
export type DependencyStatus = 'synced' | 'outdated' | 'breaking_risk';
export interface IDependencyItem {
    id: string;
    name: string;
    currentVersion: string;
    targetVersion: string;
    type: DependencyType;
    status: DependencyStatus;
    sourcePackage: string;
    consumerPackages: string[];
    impactScore: number;
}
export interface ISymbolImpactAnalysis {
    symbolName: string;
    filePath: string;
    definedInPackage: string;
    affectedServices: string[];
    breakingRiskLevel: 'critical' | 'high' | 'medium' | 'low';
    refactorRecommendation: string;
}
export interface IDependencyGraphReport {
    reportId: string;
    projectId: string;
    totalDependencies: number;
    syncedCount: number;
    outdatedCount: number;
    breakingRiskCount: number;
    monorepoHealthScore: number;
    dependencies: IDependencyItem[];
    symbolImpacts: ISymbolImpactAnalysis[];
    analyzedAt: string;
}
export interface RefactorDependencyDTO {
    dependencyId: string;
    targetVersion: string;
}
export interface AnalyzeSymbolDTO {
    symbolName: string;
}
