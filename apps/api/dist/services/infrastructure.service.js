"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infrastructureService = void 0;
const api_error_1 = require("../utils/api-error");
// In-memory store for Enterprise Infrastructure Topology & Release Rollouts
const topologyStore = new Map();
exports.infrastructureService = {
    /**
     * Retrieves or initializes the Cloud Container Topology & Infrastructure status.
     */
    getTopology: async (projectId) => {
        const existing = topologyStore.get(projectId);
        if (existing) {
            return existing;
        }
        const containers = [
            {
                id: 'node_api_01',
                name: 'devforge-api-microservice',
                serviceType: 'api',
                status: 'running',
                imageTag: 'devforge/api:v1.10.0',
                ports: ['5000:5000'],
                cpuUsagePercent: 18.4,
                memoryUsageMb: 248.5,
                replicas: 2,
                uptime: '6d 14h 22m',
            },
            {
                id: 'node_web_01',
                name: 'devforge-web-ide',
                serviceType: 'web',
                status: 'running',
                imageTag: 'devforge/web:v1.10.0',
                ports: ['3000:3000'],
                cpuUsagePercent: 12.1,
                memoryUsageMb: 184.2,
                replicas: 2,
                uptime: '6d 14h 22m',
            },
            {
                id: 'db_mongo_01',
                name: 'devforge-mongodb-cluster',
                serviceType: 'database',
                status: 'running',
                imageTag: 'mongo:7.0-official',
                ports: ['27017:27017'],
                cpuUsagePercent: 8.7,
                memoryUsageMb: 512.0,
                replicas: 3,
                uptime: '14d 08h 10m',
            },
            {
                id: 'cache_redis_01',
                name: 'devforge-redis-sentinel',
                serviceType: 'cache',
                status: 'running',
                imageTag: 'redis:7.2-alpine',
                ports: ['6379:6379'],
                cpuUsagePercent: 4.3,
                memoryUsageMb: 128.4,
                replicas: 2,
                uptime: '14d 08h 10m',
            },
            {
                id: 'worker_agent_01',
                name: 'devforge-agent-execution-worker',
                serviceType: 'worker',
                status: 'running',
                imageTag: 'devforge/agent-worker:v1.10.0',
                ports: ['9090:9090'],
                cpuUsagePercent: 24.6,
                memoryUsageMb: 360.0,
                replicas: 4,
                uptime: '2d 04h 15m',
            },
        ];
        const registryImages = [
            {
                id: 'img_01',
                repository: 'devforge/api',
                tag: 'v1.10.0',
                digest: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                sizeMb: 142.8,
                builtAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            },
            {
                id: 'img_02',
                repository: 'devforge/web',
                tag: 'v1.10.0',
                digest: 'sha256:8f4e2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
                sizeMb: 86.4,
                builtAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            },
            {
                id: 'img_03',
                repository: 'devforge/agent-worker',
                tag: 'v1.10.0',
                digest: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
                sizeMb: 198.2,
                builtAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            },
        ];
        const envSecrets = [
            { key: 'MONGODB_URI', maskedValue: 'mongodb+srv://admin:****@cluster.devforge.internal/devforge', stage: 'production', updatedAt: '2026-09-01T10:00:00Z' },
            { key: 'JWT_SECRET', maskedValue: 'devforge_sec_************************', stage: 'production', updatedAt: '2026-09-01T10:00:00Z' },
            { key: 'REDIS_HOST', maskedValue: 'redis-sentinel.devforge.internal:6379', stage: 'production', updatedAt: '2026-09-01T10:00:00Z' },
            { key: 'OPENAI_API_KEY', maskedValue: 'sk-proj-********************************', stage: 'production', updatedAt: '2026-09-05T14:30:00Z' },
            { key: 'ANTHROPIC_API_KEY', maskedValue: 'sk-ant-********************************', stage: 'production', updatedAt: '2026-09-05T14:30:00Z' },
        ];
        const activeRelease = {
            releaseId: `rel_${Date.now()}`,
            versionTag: 'v1.10.0-release',
            strategy: 'canary',
            status: 'completed',
            targetCluster: 'k8s-prod-us-east-1',
            deployedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            trafficDistribution: {
                stablePercent: 100,
                canaryPercent: 0,
            },
        };
        const runningContainersCount = containers.filter((c) => c.status === 'running').length;
        const totalCpuUsagePercent = Number((containers.reduce((acc, c) => acc + c.cpuUsagePercent, 0) / containers.length).toFixed(1));
        const totalMemoryAllocatedMb = containers.reduce((acc, c) => acc + (c.memoryUsageMb * c.replicas), 0);
        const topology = {
            reportId: `infra_top_${Date.now()}`,
            projectId,
            clusterHealthScore: 98,
            totalContainers: containers.length,
            runningContainersCount,
            totalCpuUsagePercent,
            totalMemoryAllocatedMb,
            containers,
            registryImages,
            envSecrets,
            activeRelease,
            updatedAt: new Date().toISOString(),
        };
        topologyStore.set(projectId, topology);
        return topology;
    },
    /**
     * Triggers a new Docker Image container build and pushes to cloud registry.
     */
    triggerDockerBuild: async (projectId, dto) => {
        if (!dto.repository || !dto.tag) {
            throw api_error_1.ApiError.badRequest('Repository name and tag are required for container build');
        }
        const topology = await exports.infrastructureService.getTopology(projectId);
        const newImage = {
            id: `img_${Date.now()}`,
            repository: dto.repository,
            tag: dto.tag,
            digest: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            sizeMb: Number((100 + Math.random() * 80).toFixed(1)),
            builtAt: new Date().toISOString(),
        };
        topology.registryImages.unshift(newImage);
        topology.updatedAt = new Date().toISOString();
        topologyStore.set(projectId, topology);
        return newImage;
    },
    /**
     * Scales replica count for a specific container service node.
     */
    scaleService: async (projectId, dto) => {
        const topology = await exports.infrastructureService.getTopology(projectId);
        const container = topology.containers.find((c) => c.id === dto.containerId || c.name === dto.containerId);
        if (!container) {
            throw api_error_1.ApiError.notFound(`Container service not found with ID: ${dto.containerId}`);
        }
        if (dto.targetReplicas < 1 || dto.targetReplicas > 10) {
            throw api_error_1.ApiError.badRequest('Target replicas must be between 1 and 10');
        }
        container.replicas = dto.targetReplicas;
        topology.totalMemoryAllocatedMb = topology.containers.reduce((acc, c) => acc + (c.memoryUsageMb * c.replicas), 0);
        topology.updatedAt = new Date().toISOString();
        topologyStore.set(projectId, topology);
        return container;
    },
    /**
     * Triggers a production release rollout (canary / blue-green / rolling).
     */
    deployProductionRelease: async (projectId, dto) => {
        if (!dto.versionTag) {
            throw api_error_1.ApiError.badRequest('Release version tag is required');
        }
        const topology = await exports.infrastructureService.getTopology(projectId);
        const newRelease = {
            releaseId: `rel_${Date.now()}`,
            versionTag: dto.versionTag,
            strategy: dto.strategy || 'canary',
            status: 'in_progress',
            targetCluster: 'k8s-prod-us-east-1',
            deployedAt: new Date().toISOString(),
            trafficDistribution: {
                stablePercent: 80,
                canaryPercent: 20,
            },
        };
        // Fast-forward to completed state for active release simulation
        setTimeout(() => {
            newRelease.status = 'completed';
            newRelease.trafficDistribution.stablePercent = 100;
            newRelease.trafficDistribution.canaryPercent = 0;
        }, 100);
        topology.activeRelease = newRelease;
        topology.updatedAt = new Date().toISOString();
        topologyStore.set(projectId, topology);
        return newRelease;
    },
};
