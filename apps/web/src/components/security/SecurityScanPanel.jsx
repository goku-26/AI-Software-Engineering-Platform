import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  Play,
  Sparkles,
  FileCode,
  Check,
  Filter,
  Lock,
  Zap,
  Layers,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { securityService } from '../../services/security.service';

export const SecurityScanPanel = ({ projectId, onPatchApplied }) => {
  const [latestScan, setLatestScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'critical' | 'high' | 'medium' | 'low'

  // Remediation State
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [isRemediating, setIsRemediating] = useState(false);
  const [remediationResult, setRemediationResult] = useState(null);
  const [isApplyingPatch, setIsApplyingPatch] = useState(false);
  const [appliedVulnIds, setAppliedVulnIds] = useState(new Set());
  const [activeDiffTab, setActiveDiffTab] = useState('remediated'); // 'remediated' | 'original'

  useEffect(() => {
    if (!projectId) return;
    fetchHistory();
  }, [projectId]);

  const fetchHistory = async () => {
    try {
      const history = await securityService.getHistory(projectId);
      if (history && history.length > 0) {
        setLatestScan(history[0]);
      }
    } catch (err) {
      console.error('Failed to fetch security scan history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRunScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    try {
      const scan = await securityService.runScan(projectId);
      setLatestScan(scan);
      setRemediationResult(null);
      setSelectedVuln(null);
    } catch (err) {
      alert('Failed to execute security scan: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTriggerRemediation = async (vuln) => {
    setSelectedVuln(vuln);
    setIsRemediating(true);
    try {
      const result = await securityService.remediate(projectId, {
        vulnerabilityId: vuln.id,
        filePath: vuln.filePath,
      });
      setRemediationResult(result);
    } catch (err) {
      alert('Failed to generate security remediation: ' + err.message);
    } finally {
      setIsRemediating(false);
    }
  };

  const handleApplyRemediation = async () => {
    if (!selectedVuln || isApplyingPatch) return;
    setIsApplyingPatch(true);
    try {
      await securityService.applyRemediation(projectId, {
        vulnerabilityId: selectedVuln.id,
      });
      setAppliedVulnIds((prev) => new Set(prev).add(selectedVuln.id));

      // Update active scan state locally
      if (latestScan) {
        const updatedVulns = latestScan.vulnerabilities.map((v) =>
          v.id === selectedVuln.id ? { ...v, status: 'remediated' } : v
        );
        const criticalCount = updatedVulns.filter((v) => v.severity === 'critical' && v.status === 'open').length;
        const highCount = updatedVulns.filter((v) => v.severity === 'high' && v.status === 'open').length;
        const mediumCount = updatedVulns.filter((v) => v.severity === 'medium' && v.status === 'open').length;
        const lowCount = updatedVulns.filter((v) => v.severity === 'low' && v.status === 'open').length;
        const penalty = criticalCount * 25 + highCount * 15 + mediumCount * 8 + lowCount * 4;
        const securityScore = Math.max(0, 100 - penalty);

        setLatestScan({
          ...latestScan,
          vulnerabilities: updatedVulns,
          criticalCount,
          highCount,
          mediumCount,
          lowCount,
          securityScore,
        });
      }

      if (onPatchApplied) {
        onPatchApplied(selectedVuln.filePath);
      }
    } catch (err) {
      alert('Failed to apply security patch: ' + err.message);
    } finally {
      setIsApplyingPatch(false);
    }
  };

  const filteredVulnerabilities = latestScan?.vulnerabilities?.filter((v) => {
    if (severityFilter === 'critical') return v.severity === 'critical';
    if (severityFilter === 'high') return v.severity === 'high';
    if (severityFilter === 'medium') return v.severity === 'medium';
    if (severityFilter === 'low') return v.severity === 'low';
    return true;
  }) || [];

  const getSeverityBadgeVariant = (sev) => {
    switch (sev) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Top Banner & Scan Action Bar */}
      <div className="bg-gradient-to-r from-surface to-surface-subtle p-6 rounded-2xl border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-mono font-bold text-xl shadow-lg ${getScoreColorClass(latestScan?.securityScore ?? 100)}`}>
            {latestScan ? `${latestScan.securityScore}%` : '100%'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Static Application Security Testing (SAST)</h2>
              <Badge variant="info" className="uppercase font-mono text-[10px]">
                Phase 6 Engine Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated CWE vulnerability scanning, secret leakage detection, and AI security patch remediation.
            </p>
          </div>
        </div>

        <Button
          id="run-security-scan-btn"
          onClick={handleRunScan}
          variant="primary"
          isLoading={isScanning}
          className="shadow-lg shadow-brand-600/30"
          leftIcon={<ShieldAlert className="w-4 h-4" />}
        >
          {isScanning ? 'Scanning Workspace Code...' : 'Run Automated Security Scan'}
        </Button>
      </div>

      {/* Security Metrics Row */}
      {latestScan && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Scanned Files</span>
            <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{latestScan.scannedFilesCount}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Critical Risks</span>
            <p className="text-2xl font-bold text-rose-400 font-mono mt-1">{latestScan.criticalCount}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">High Risks</span>
            <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{latestScan.highCount}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Medium Risks</span>
            <p className="text-2xl font-bold text-yellow-400 font-mono mt-1">{latestScan.mediumCount}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Low Risks</span>
            <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">{latestScan.lowCount}</p>
          </Card>
        </div>
      )}

      {/* Main Content Layout: Vulnerability List & Remediation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vulnerabilities List */}
        <div className={remediationResult ? 'lg:col-span-6 space-y-4' : 'lg:col-span-12 space-y-4'}>
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-accent" />
                Detected Security Vulnerabilities ({filteredVulnerabilities.length})
              </h3>

              {/* Severity Filter */}
              <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-lg border border-surface-border text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                  <button
                    key={sev}
                    id={`severity-filter-${sev}`}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                      severityFilter === sev
                        ? sev === 'critical'
                          ? 'bg-rose-600 text-white'
                          : sev === 'high'
                          ? 'bg-amber-600 text-white'
                          : 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingHistory ? (
              <p className="text-xs text-slate-400 text-center py-8">Loading security scan report...</p>
            ) : filteredVulnerabilities.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">Zero Vulnerabilities Found</p>
                <p className="text-[11px] text-slate-500">Your workspace satisfies active security compliance policies.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredVulnerabilities.map((vuln) => {
                  const isRemediated = vuln.status === 'remediated' || appliedVulnIds.has(vuln.id);
                  return (
                    <div
                      key={vuln.id}
                      className={`bg-surface-subtle/50 border rounded-xl p-4 space-y-3 transition-all ${
                        selectedVuln?.id === vuln.id
                          ? 'border-brand-500 shadow-lg shadow-brand-500/10'
                          : isRemediated
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-surface-border/80 hover:border-surface-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {isRemediated ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={getSeverityBadgeVariant(vuln.severity)} className="uppercase font-mono text-[10px]">
                                {vuln.severity}
                              </Badge>
                              <Badge variant="neutral" className="font-mono text-[10px]">
                                {vuln.cweId}
                              </Badge>
                              {isRemediated && (
                                <Badge variant="success" className="uppercase font-mono text-[10px]">
                                  REMEDIATED
                                </Badge>
                              )}
                              <h4 className="text-xs font-semibold text-slate-200">{vuln.title}</h4>
                            </div>
                            <p className="text-[11px] font-mono text-brand-accent mt-1 flex items-center gap-1">
                              <FileCode className="w-3 h-3" />
                              {vuln.filePath}:{vuln.lineNumber}
                            </p>
                          </div>
                        </div>

                        <Button
                          id={`remediate-btn-${vuln.id}`}
                          onClick={() => handleTriggerRemediation(vuln)}
                          variant={isRemediated ? 'secondary' : 'primary'}
                          size="sm"
                          isLoading={isRemediating && selectedVuln?.id === vuln.id}
                          leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-accent" />}
                        >
                          {isRemediated ? 'View Security Remediation' : 'AI Auto-Fix Remediation'}
                        </Button>
                      </div>

                      <p className="text-xs text-slate-400 pl-7 leading-relaxed">{vuln.description}</p>

                      {/* Code Snippet Box */}
                      <div className="bg-[#080A0E] p-2.5 rounded-lg font-mono text-[11px] text-rose-300 border border-rose-500/20 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{vuln.snippet}</pre>
                      </div>

                      {/* Recommendation Box */}
                      <div className="bg-surface-subtle p-2.5 rounded-lg text-[11px] text-slate-300 border border-surface-border flex items-start gap-2">
                        <span className="text-brand-accent font-bold">💡</span>
                        <span>{vuln.recommendation}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: AI Remediation Code Patch View */}
        {remediationResult && (
          <div className="lg:col-span-6 space-y-4">
            <Card className="space-y-4 bg-gradient-to-r from-surface to-surface-subtle border-brand-500/40">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-accent" />
                    AI Security Remediation Engine
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Target File: {remediationResult.filePath}
                  </p>
                </div>

                <Button
                  id="apply-security-patch-btn"
                  onClick={handleApplyRemediation}
                  variant={appliedVulnIds.has(selectedVuln?.id) ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={appliedVulnIds.has(selectedVuln?.id)}
                  isLoading={isApplyingPatch}
                  leftIcon={appliedVulnIds.has(selectedVuln?.id) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
                >
                  {appliedVulnIds.has(selectedVuln?.id) ? 'Remediation Patch Applied' : 'Apply Security Patch to Workspace'}
                </Button>
              </div>

              {/* Analysis Explanation Card */}
              <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl p-3.5 text-xs text-brand-100 space-y-1">
                <span className="font-semibold text-brand-accent block uppercase text-[10px] font-mono">
                  DevForge AI Remediation Analysis:
                </span>
                <p className="leading-relaxed text-slate-300 text-[11px]">{remediationResult.explanation}</p>
              </div>

              {/* Tabbed Code Preview */}
              <Card className="p-0 overflow-hidden border border-surface-border">
                <div className="h-10 bg-surface-subtle px-4 border-b border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
                    <FileCode className="w-4 h-4 text-brand-accent" />
                    <span>{remediationResult.filePath}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDiffTab('remediated')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                        activeDiffTab === 'remediated' ? 'bg-brand-600/30 text-brand-accent font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Remediated Code
                    </button>
                    <button
                      onClick={() => setActiveDiffTab('original')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                        activeDiffTab === 'original' ? 'bg-surface-border text-slate-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Vulnerable Base
                    </button>
                  </div>
                </div>

                <div className="bg-[#0B0D10] p-4 font-mono text-xs overflow-x-auto max-h-96">
                  <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeDiffTab === 'remediated' ? remediationResult.remediatedCode : remediationResult.originalCode}
                  </pre>
                </div>
              </Card>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
