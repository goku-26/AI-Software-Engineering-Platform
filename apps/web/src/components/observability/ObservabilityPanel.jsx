import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  DollarSign,
  Zap,
  Sparkles,
  Clock,
  Terminal,
  CheckCircle2,
  BarChart3,
  Layers,
  RefreshCw,
  Gauge,
  Code2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { observabilityService } from '../../services/observability.service';

export const ObservabilityPanel = ({ projectId }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    fetchReport();
  }, [projectId]);

  const fetchReport = async () => {
    try {
      const data = await observabilityService.getReport(projectId);
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch observability report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunBenchmark = async () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditMessage(null);
    try {
      const result = await observabilityService.runBenchmark(projectId);
      setReport((prev) => (prev ? { ...prev, benchmarkScore: result.benchmarkScore } : prev));
      setAuditMessage(result.details);
    } catch (err) {
      alert('Failed to run LLM benchmark: ' + err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-surface to-surface-subtle p-6 rounded-2xl border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold text-xl shadow-lg shadow-cyan-500/10">
            {report ? `${report.benchmarkScore}%` : '96%'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Observability &amp; Analytics Engine</h2>
              <Badge variant="info" className="uppercase font-mono text-[10px]">
                Phase 8 Engine Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time LLM token consumption tracking, model cost governance, agent latency profiling, and tool trace logs.
            </p>
          </div>
        </div>

        <Button
          id="run-llm-benchmark-btn"
          onClick={handleRunBenchmark}
          variant="primary"
          isLoading={isAuditing}
          className="shadow-lg shadow-brand-600/30"
          leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
        >
          {isAuditing ? 'Evaluating Agent Accuracy...' : 'Run LLM Benchmark Audit'}
        </Button>
      </div>

      {auditMessage && (
        <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl p-4 text-xs text-brand-100 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-accent shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Metrics Summary Row */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Tokens Consumed</span>
            <p className="text-2xl font-bold text-slate-100 font-mono mt-1">
              {(report.totalTokensConsumed / 1000).toFixed(1)}K
            </p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Total LLM Cost</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              ${report.totalCostUsd.toFixed(2)}
            </p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Avg Agent Latency</span>
            <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">
              {report.averageLatencyMs} ms
            </p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Benchmark Quality</span>
            <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">
              {report.benchmarkScore}%
            </p>
          </Card>
        </div>
      )}

      {/* Section 1: Model Provider Usage Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-accent" />
          Model Provider Token &amp; Cost Allocation
        </h3>

        {isLoading ? (
          <p className="text-xs text-slate-400 text-center py-6">Loading observability analytics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {report?.modelProviderStats.map((prov) => (
              <Card key={prov.provider} className="p-4 space-y-3 bg-surface/80 border-surface-border hover:border-surface-border/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">{prov.name}</span>
                  <Badge variant="neutral" className="font-mono text-[10px]">
                    {prov.callCount} calls
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Tokens:</span>
                    <span className="text-slate-200 font-bold">{prov.tokensConsumed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Est Cost:</span>
                    <span className="text-emerald-400 font-bold">${prov.costUsd.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Agent Role Performance */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          Agent Performance &amp; Execution Profiling
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {report?.agentRoleStats.map((agent) => (
            <Card key={agent.role} className="p-4 space-y-2.5 bg-surface/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{agent.label}</span>
                <Badge variant="success" className="font-mono text-[10px]">
                  {agent.successRate}% Success
                </Badge>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Tasks Run:</span>
                  <span className="text-slate-200">{agent.taskCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Latency:</span>
                  <span className="text-cyan-400">{agent.avgLatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Tokens/Task:</span>
                  <span className="text-slate-300">{agent.avgTokensPerTask}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Real-Time Tool Call Logs Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Agent Tool Invocation Traces Log ({report?.toolCallLogs.length || 0})
          </h3>
          <span className="text-[10px] font-mono text-slate-400 uppercase">REAL-TIME TELEMETRY</span>
        </div>

        <div className="space-y-2.5">
          {report?.toolCallLogs.map((log) => (
            <div
              key={log.id}
              className="bg-surface-subtle/50 border border-surface-border/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-brand-accent shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 font-mono">{log.toolName}</span>
                    <Badge variant="neutral" className="capitalize font-mono text-[10px]">
                      {log.agentRole}
                    </Badge>
                    <Badge variant="success" className="uppercase font-mono text-[10px]">
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{log.argumentsSnippet}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 shrink-0">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {log.executionTimeMs} ms
                </span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
