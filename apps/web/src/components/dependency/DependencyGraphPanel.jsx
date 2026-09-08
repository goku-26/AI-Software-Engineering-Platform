import { useState, useEffect } from 'react';
import {
  Network,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Code2,
  FileCode,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { dependencyService } from '../../services/dependency.service';

export const DependencyGraphPanel = ({ projectId }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchSymbol, setSearchSymbol] = useState('IAgentTask');
  const [activeImpactAnalysis, setActiveImpactAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [syncedIds, setSyncedIds] = useState(new Set());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetchReport();
  }, [projectId]);

  const fetchReport = async () => {
    try {
      const data = await dependencyService.getGraph(projectId);
      setReport(data);
      if (data?.symbolImpacts?.length > 0) {
        setActiveImpactAnalysis(data.symbolImpacts[0]);
      }
    } catch (err) {
      console.error('Failed to fetch dependency report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunImpactAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!searchSymbol.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const analysis = await dependencyService.analyzeImpact(projectId, {
        symbolName: searchSymbol.trim(),
      });
      setActiveImpactAnalysis(analysis);
    } catch (err) {
      alert('Failed to analyze symbol impact: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSyncDependency = async (dep) => {
    if (isSyncing || syncedIds.has(dep.id)) return;
    setIsSyncing(true);
    try {
      await dependencyService.refactor(projectId, {
        dependencyId: dep.id,
        targetVersion: dep.targetVersion,
      });
      setSyncedIds((prev) => new Set(prev).add(dep.id));
      setReport((prev) => {
        if (!prev) return prev;
        const updated = prev.dependencies.map((d) =>
          d.id === dep.id ? { ...d, status: 'synced', currentVersion: dep.targetVersion } : d
        );
        const syncedCount = updated.filter((d) => d.status === 'synced').length;
        const outdatedCount = updated.filter((d) => d.status === 'outdated').length;
        const monorepoHealthScore = Math.round((syncedCount / updated.length) * 100);
        return { ...prev, dependencies: updated, syncedCount, outdatedCount, monorepoHealthScore };
      });
    } catch (err) {
      alert('Failed to sync dependency: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-surface to-surface-subtle p-6 rounded-2xl border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono font-bold text-xl shadow-lg shadow-indigo-500/10">
            <Network className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Monorepo &amp; Cross-Service Dependency Engine</h2>
              <Badge variant="info" className="uppercase font-mono text-[10px]">
                Phase 9 Engine Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cross-repository dependency graph, monorepo package sync (<code className="font-mono text-brand-accent">@devforge/shared</code>), and cross-service symbol impact analysis.
            </p>
          </div>
        </div>

        <Button
          id="run-symbol-impact-btn"
          onClick={handleRunImpactAnalysis}
          variant="primary"
          isLoading={isAnalyzing}
          className="shadow-lg shadow-brand-600/30"
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          {isAnalyzing ? 'Analyzing Symbol Impact...' : 'Analyze Symbol Impact'}
        </Button>
      </div>

      {/* Metrics Summary Row */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Total Workspace Packages</span>
            <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{report.totalDependencies}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Synced Dependencies</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{report.syncedCount}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Outdated Packages</span>
            <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{report.outdatedCount}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Monorepo Health Score</span>
            <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">{report.monorepoHealthScore}%</p>
          </Card>
        </div>
      )}

      {/* Main Grid Layout: Package List & Symbol Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monorepo Package Explorer */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-accent" />
                Monorepo Package Graph &amp; Dependencies ({report?.dependencies.length || 0})
              </h3>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-400 text-center py-6">Scanning monorepo package relationships...</p>
            ) : (
              <div className="space-y-3">
                {report?.dependencies.map((dep) => {
                  const isSynced = dep.status === 'synced' || syncedIds.has(dep.id);
                  return (
                    <div
                      key={dep.id}
                      className={`bg-surface-subtle/50 border rounded-xl p-4 space-y-2.5 transition-all ${
                        dep.type === 'internal_monorepo'
                          ? 'border-brand-500/40 bg-brand-600/5'
                          : 'border-surface-border/80 hover:border-surface-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                          <h4 className="text-xs font-bold text-slate-100 font-mono">{dep.name}</h4>
                          <Badge
                            variant={dep.type === 'internal_monorepo' ? 'info' : 'neutral'}
                            className="font-mono text-[10px]"
                          >
                            {dep.type === 'internal_monorepo' ? 'INTERNAL MONOREPO' : 'NPM PACKAGE'}
                          </Badge>
                        </div>

                        {isSynced ? (
                          <Badge variant="success" className="font-mono uppercase text-[10px] gap-1">
                            <Check className="w-3 h-3" /> SYNCED v{dep.currentVersion}
                          </Badge>
                        ) : (
                          <Button
                            id={`sync-dep-btn-${dep.id}`}
                            onClick={() => handleSyncDependency(dep)}
                            variant="primary"
                            size="sm"
                            isLoading={isSyncing}
                            leftIcon={<RefreshCw className="w-3 h-3" />}
                          >
                            Sync to v{dep.targetVersion}
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-500" />
                          Source: <strong className="text-slate-200">{dep.sourcePackage}</strong>
                        </span>
                        <span className="text-slate-400">
                          Consumed by: <strong className="text-brand-accent">{dep.consumerPackages.join(', ')}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Symbol Impact Analysis */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="space-y-4 bg-gradient-to-r from-surface to-surface-subtle border-brand-500/40">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-accent" />
                Cross-Service Symbol Impact Analyzer
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Type a symbol name to analyze the refactoring blast radius across microservices.
              </p>
            </div>

            {/* Symbol Search Form */}
            <form onSubmit={handleRunImpactAnalysis} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Target Symbol / Function / Type</label>
              <div className="flex gap-2">
                <Input
                  id="symbol-search-input"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  placeholder="e.g. IAgentTask, verifyToken, loginUser"
                  className="font-mono text-xs"
                />
                <Button
                  id="search-symbol-btn"
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isAnalyzing}
                >
                  Analyze
                </Button>
              </div>
            </form>

            {/* Impact Result Card */}
            {activeImpactAnalysis && (
              <div className="space-y-3 pt-2 border-t border-surface-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-accent font-mono">
                    ✦ {activeImpactAnalysis.symbolName}
                  </span>
                  <Badge
                    variant={activeImpactAnalysis.breakingRiskLevel === 'high' ? 'warning' : 'info'}
                    className="uppercase font-mono text-[10px]"
                  >
                    {activeImpactAnalysis.breakingRiskLevel} BREAKING RISK
                  </Badge>
                </div>

                <div className="bg-[#080B10] p-3 rounded-lg border border-surface-border font-mono text-[11px] space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    <span>Defined in:</span>
                    <strong className="text-slate-200">{activeImpactAnalysis.filePath}</strong>
                  </div>

                  <div className="text-slate-400 pt-1">
                    <span>Impacted Consumer Services ({activeImpactAnalysis.affectedServices.length}):</span>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-brand-accent">
                      {activeImpactAnalysis.affectedServices.map((svc, idx) => (
                        <li key={idx}>{svc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Refactor Recommendation Note */}
                <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-brand-accent block text-[10px] font-mono">
                    DevForge AI Refactoring Recommendation:
                  </span>
                  <p className="leading-relaxed text-[11px]">{activeImpactAnalysis.refactorRecommendation}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
