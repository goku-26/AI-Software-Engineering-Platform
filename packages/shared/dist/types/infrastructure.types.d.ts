export type ContainerStatus = 'running' | 'degraded' | 'stopped' | 'restarting';
export interface IContainerNode {
    id: string;
    name: string;
    serviceType: 'api' | 'web' | 'database' | 'cache' | 'worker';
    status: ContainerStatus;
    imageTag: string;
    ports: string[];
    cpuUsagePercent: number;
    memoryUsageMb: number;
    replicas: number;
    uptime: string;
}
export interface IDockerRegistryImage {
    id: string;
    repository: string;
    tag: string;
    digest: string;
    sizeMb: number;
    builtAt: string;
}
export interface IEnvSecretItem {
    key: string;
    maskedValue: string;
    stage: 'production' | 'staging' | 'development';
    updatedAt: string;
}
export interface IProductionReleaseRollout {
    releaseId: string;
    versionTag: string;
    strategy: 'canary' | 'blue_green' | 'rolling';
    status: 'in_progress' | 'completed' | 'rolled_back';
    targetCluster: string;
    deployedAt: string;
    trafficDistribution: {
        stablePercent: number;
        canaryPercent: number;
    };
}
export interface IInfrastructureTopology {
    reportId: string;
    projectId: string;
    clusterHealthScore: number;
    totalContainers: number;
    runningContainersCount: number;
    totalCpuUsagePercent: number;
    totalMemoryAllocatedMb: number;
    containers: IContainerNode[];
    registryImages: IDockerRegistryImage[];
    envSecrets: IEnvSecretItem[];
    activeRelease: IProductionReleaseRollout;
    updatedAt: string;
}
export interface ScaleReplicasDTO {
    containerId: string;
    targetReplicas: number;
}
export interface TriggerDockerBuildDTO {
    repository: string;
    tag: string;
}
export interface TriggerReleaseDTO {
    versionTag: string;
    strategy: 'canary' | 'blue_green' | 'rolling';
}
