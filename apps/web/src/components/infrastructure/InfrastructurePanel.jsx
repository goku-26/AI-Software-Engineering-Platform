import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Box,
  RefreshCw,
  PlusCircle,
  Play,
  CheckCircle,
  AlertTriangle,
  Lock,
  Terminal,
  ArrowUpRight,
  Shield,
  Gauge,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { infrastructureService } from '../../services/infrastructure.service';

export const InfrastructurePanel = ({ projectId }) => {
  const [topology, setTopology] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [scalingId, setScalingId] = useState(null);

  // New Image Form Modal state
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [buildRepo, setBuildRepo] = useState('devforge/api');
  const [buildTag, setBuildTag] = useState('v1.11.0');

  // New Release Form Modal state
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseTag, setReleaseTag] = useState('v1.11.0-release');
  const [releaseStrategy, setReleaseStrategy] = useState('canary');

  // Success Notification toast
  const [toastMessage, setToastMessage] = useState('');

  const fetchTopology = async () => {
    try {
      const data = await infrastructureService.getTopology(projectId);
      setTopology(data);
    } catch (err) {
      console.error('Failed to load infrastructure topology:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTopology();
    }
  }, [projectId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleScale = async (containerId, currentReplicas, delta) => {
    const target = currentReplicas + delta;
    if (target < 1 || target > 10) return;
    setScalingId(containerId);
    try {
      await infrastructureService.scaleService(projectId, {
        containerId,
        targetReplicas: target,
      });
      await fetchTopology();
      showToast(`Scaled service replicas to ${target}`);
    } catch (err) {
      alert(err.message || 'Failed to scale container service');
    } finally {
      setScalingId(null);
    }
  };

  const handleTriggerBuild = async (e) => {
    e.preventDefault();
    if (!buildRepo || !buildTag) return;
    setIsBuilding(true);
    try {
      await infrastructureService.triggerDockerBuild(projectId, {
        repository: buildRepo,
        tag: buildTag,
      });
      await fetchTopology();
      setShowBuildModal(false);
      showToast(`Built & pushed container image ${buildRepo}:${buildTag}`);
    } catch (err) {
      alert(err.message || 'Failed to trigger Docker build');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDeployRelease = async (e) => {
    e.preventDefault();
    if (!releaseTag) return;
    setIsDeploying(true);
    try {
      await infrastructureService.deployRelease(projectId, {
        versionTag: releaseTag,
        strategy: releaseStrategy,
      });
      await fetchTopology();
      setShowReleaseModal(false);
      showToast(`Triggered ${releaseStrategy.toUpperCase()} production release ${releaseTag}`);
    } catch (err) {
      alert(err.message || 'Failed to deploy production release');
    } finally {
      setIsDeploying(false);
    }
  };

  if (isLoading) {
    return <Card className="text-center py-16 text-slate-400">Loading Enterprise Infrastructure Topology...</Card>;
  }

  if (!topology) {
    return (
      <Card className="text-center py-16 text-slate-400 space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <p>Failed to load cluster infrastructure details.</p>
        <Button onClick={fetchTopology} variant="outline" size="sm">
          Retry Connection
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-1">
      {/* Header Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Infrastructure Top Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-5 rounded-2xl border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Enterprise Infrastructure &amp; Cloud Release</h2>
              <Badge variant="success" className="font-mono text-[10px]">
                PHASE 10 ENGINE ACTIVE
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kubernetes cluster topology, container node scaling, Docker registry, and production release pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowBuildModal(true)}
            variant="outline"
            size="sm"
            leftIcon={<Box className="w-4 h-4" />}
          >
            Build Docker Image
          </Button>
          <Button
            onClick={() => setShowReleaseModal(true)}
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-4 h-4" />}
          >
            Rollout Release
          </Button>
        </div>
      </div>

      {/* Cluster Health Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            Cluster Health Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{topology.clusterHealthScore}%</span>
            <span className="text-xs text-emerald-500 font-medium">Optimal</span>
          </div>
        </Card>

        <Card className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Running Containers
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {topology.runningContainersCount} / {topology.totalContainers}
            </span>
            <span className="text-xs text-slate-400">Services Active</span>
          </div>
        </Card>

        <Card className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Avg CPU Utilization
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">{topology.totalCpuUsagePercent}%</span>
            <span className="text-xs text-slate-400">Cluster Load</span>
          </div>
        </Card>

        <Card className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            Allocated RAM
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-400">
              {(topology.totalMemoryAllocatedMb / 1024).toFixed(2)} GB
            </span>
            <span className="text-xs text-slate-400">Total Provisioned</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Container Topology & Production Release */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Container Node Topology Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Container Node Topology ({topology.containers.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Managed via Kubernetes / Docker Compose</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topology.containers.map((container) => (
              <Card key={container.id} className="space-y-3 relative border-surface-border/80">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{container.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{container.imageTag}</span>
                    </div>
                  </div>
                  <Badge variant="info" className="uppercase text-[9px] font-mono">
                    {container.serviceType}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-subtle p-2.5 rounded-lg font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PORTS</span>
                    <span className="text-slate-200 font-bold">{container.ports.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">UPTIME</span>
                    <span className="text-emerald-400 font-bold">{container.uptime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CPU USAGE</span>
                    <span className="text-amber-400 font-bold">{container.cpuUsagePercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">MEMORY</span>
                    <span className="text-indigo-400 font-bold">{container.memoryUsageMb} MB</span>
                  </div>
                </div>

                {/* Replica Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-surface-border">
                  <span className="text-xs text-slate-400 font-medium">Replicas:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleScale(container.id, container.replicas, -1)}
                      disabled={container.replicas <= 1 || scalingId === container.id}
                      className="w-6 h-6 rounded bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white font-mono w-4 text-center">
                      {container.replicas}
                    </span>
                    <button
                      onClick={() => handleScale(container.id, container.replicas, 1)}
                      disabled={container.replicas >= 10 || scalingId === container.id}
                      className="w-6 h-6 rounded bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Docker Registry Table */}
          <Card className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-purple-400" />
                Docker Image Registry ({topology.registryImages.length})
              </h3>
              <Button onClick={() => setShowBuildModal(true)} variant="ghost" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                Build Image
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-surface-border">
                    <th className="pb-2">Repository</th>
                    <th className="pb-2">Tag</th>
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Digest</th>
                    <th className="pb-2 text-right">Built At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50 text-slate-300">
                  {topology.registryImages.map((img) => (
                    <tr key={img.id} className="hover:bg-surface-subtle/40">
                      <td className="py-2.5 font-bold text-slate-200">{img.repository}</td>
                      <td className="py-2.5 text-cyan-400">{img.tag}</td>
                      <td className="py-2.5">{img.sizeMb} MB</td>
                      <td className="py-2.5 text-slate-500 truncate max-w-[120px]">{img.digest}</td>
                      <td className="py-2.5 text-right text-slate-400 text-[11px]">
                        {new Date(img.builtAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Active Production Release & Environment Secrets */}
        <div className="space-y-6">
          {/* Production Release Pipeline Card */}
          <Card className="space-y-4 border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-surface">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                Active Production Release
              </h3>
              <Badge variant="success" className="uppercase font-mono text-[9px]">
                {topology.activeRelease.status}
              </Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-surface-border/60">
                <span className="text-slate-400">Target Cluster</span>
                <span className="text-slate-200 font-bold">{topology.activeRelease.targetCluster}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/60">
                <span className="text-slate-400">Release Version</span>
                <span className="text-emerald-400 font-bold">{topology.activeRelease.versionTag}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/60">
                <span className="text-slate-400">Strategy</span>
                <span className="text-purple-400 uppercase font-bold">{topology.activeRelease.strategy}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Deployed At</span>
                <span className="text-slate-300 text-[11px]">
                  {new Date(topology.activeRelease.deployedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Traffic Distribution Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Stable Traffic ({topology.activeRelease.trafficDistribution.stablePercent}%)</span>
                <span className="text-cyan-400">Canary ({topology.activeRelease.trafficDistribution.canaryPercent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden flex">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${topology.activeRelease.trafficDistribution.stablePercent}%` }}
                />
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${topology.activeRelease.trafficDistribution.canaryPercent}%` }}
                />
              </div>
            </div>

            <Button
              onClick={() => setShowReleaseModal(true)}
              variant="primary"
              className="w-full mt-2"
              size="sm"
              leftIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Rollout New Version
            </Button>
          </Card>

          {/* Environment Secrets Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Environment Secrets ({topology.envSecrets.length})
              </h3>
              <Badge variant="warning" className="text-[9px]">
                ENCRYPTED (AES-256)
              </Badge>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {topology.envSecrets.map((secret) => (
                <div
                  key={secret.key}
                  className="p-2.5 bg-surface-subtle/70 rounded-lg border border-surface-border/50 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{secret.key}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-surface-border text-slate-400">
                      {secret.stage}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate">{secret.maskedValue}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Build Docker Image Modal */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-purple-400" />
              Build &amp; Push Docker Image
            </h3>
            <form onSubmit={handleTriggerBuild} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Repository Name</label>
                <input
                  type="text"
                  value={buildRepo}
                  onChange={(e) => setBuildRepo(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Tag</label>
                <input
                  type="text"
                  value={buildTag}
                  onChange={(e) => setBuildTag(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" onClick={() => setShowBuildModal(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isBuilding}>
                  Start Build
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Release Rollout Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              Rollout Production Release
            </h3>
            <form onSubmit={handleDeployRelease} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Release Version Tag</label>
                <input
                  type="text"
                  value={releaseTag}
                  onChange={(e) => setReleaseTag(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deployment Strategy</label>
                <select
                  value={releaseStrategy}
                  onChange={(e) => setReleaseStrategy(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="canary">Canary (20% &rarr; 100%)</option>
                  <option value="blue_green">Blue / Green (Instant Switch)</option>
                  <option value="rolling">Rolling Upgrade</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" onClick={() => setShowReleaseModal(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isDeploying}>
                  Trigger Rollout
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
