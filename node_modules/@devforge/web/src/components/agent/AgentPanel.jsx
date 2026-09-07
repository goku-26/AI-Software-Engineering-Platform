import React, { useState, useEffect } from 'react';
import {
  Zap,
  Cpu,
  Code2,
  ShieldCheck,
  Play,
  CheckCircle2,
  Clock,
  FileCode,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  History,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { agentService } from '../../services/agent.service';

export const AgentPanel = ({ projectId, onPatchApplied }) => {
  const [role, setRole] = useState('coder');
  const [prompt, setPrompt] = useState('');
  const [targetFile, setTargetFile] = useState('src/controllers/authController.js');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isApplyingPatch, setIsApplyingPatch] = useState(false);
  const [activeDiffTab, setActiveDiffTab] = useState('new'); // 'new' | 'original'

  const promptSuggestions = [
    'Add strict JWT payload verification & expiration to authController.js',
    'Refactor auth middleware to prevent token bypass vulnerabilities',
    'Implement structured try-catch guards & HTTP status codes',
  ];

  useEffect(() => {
    if (!projectId) return;
    fetchHistory();
  }, [projectId]);

  const fetchHistory = async () => {
    try {
      const history = await agentService.getProjectTasks(projectId);
      setTaskHistory(history);
      if (history.length > 0 && !currentTask) {
        setCurrentTask(history[0]);
      }
    } catch (err) {
      console.error('Failed to fetch agent history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleExecuteAgent = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isExecuting) return;

    setIsExecuting(true);
    try {
      const task = await agentService.executeTask(projectId, {
        prompt: prompt.trim(),
        role,
        targetFiles: [targetFile],
      });
      setCurrentTask(task);
      setTaskHistory((prev) => [task, ...prev]);
    } catch (err) {
      alert('Failed to execute AI Agent task: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApplyPatch = async () => {
    if (!currentTask || currentTask.isApplied || isApplyingPatch) return;
    setIsApplyingPatch(true);
    try {
      await agentService.applyPatch(projectId, currentTask.id);
      setCurrentTask((prev) => ({ ...prev, isApplied: true }));
      setTaskHistory((prev) =>
        prev.map((t) => (t.id === currentTask.id ? { ...t, isApplied: true } : t))
      );
      if (onPatchApplied) {
        onPatchApplied(currentTask.generatedPatch?.filePath);
      }
    } catch (err) {
      alert('Failed to apply patch: ' + err.message);
    } finally {
      setIsApplyingPatch(false);
    }
  };

  const roleOptions = [
    { id: 'coder', label: 'Coding Agent', icon: Code2, color: 'text-brand-accent', border: 'border-brand-500/40' },
    { id: 'architect', label: 'Architect Agent', icon: Cpu, color: 'text-purple-400', border: 'border-purple-500/40' },
    { id: 'reviewer', label: 'Reviewer Agent', icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { id: 'debugger', label: 'Debugger Agent', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/40' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto">
      {/* Left Form Column: Prompt & Controls */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="space-y-5 border border-surface-border bg-surface/90">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-accent" />
                AI Agent Task Orchestrator
              </h3>
              <Badge variant="info" className="uppercase font-mono text-[10px]">
                Phase 4 Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select an agent role, specify your task objective, and execute multi-stage code transformations.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Agent Execution Role</label>
            <div className="grid grid-cols-2 gap-2.5">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    id={`role-btn-${opt.id}`}
                    onClick={() => setRole(opt.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                      isSelected
                        ? `bg-surface-subtle text-slate-100 ${opt.border} shadow-lg shadow-brand-500/10`
                        : 'bg-surface/50 border-surface-border/60 text-slate-400 hover:text-slate-200 hover:bg-surface-subtle/50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-surface flex items-center justify-center ${opt.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target File Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Target Workspace File</label>
            <div className="relative">
              <FileCode className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                id="agent-target-file-input"
                value={targetFile}
                onChange={(e) => setTargetFile(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-subtle border border-surface-border rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
                placeholder="e.g. src/controllers/authController.js"
              />
            </div>
          </div>

          {/* Task Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Task Objective / Prompt</label>
            <textarea
              id="agent-prompt-textarea"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the code changes or refactoring objective for the AI agents..."
              className="w-full p-3 bg-surface-subtle border border-surface-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Prompt Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium block">Quick Prompt Presets:</span>
            <div className="space-y-1.5">
              {promptSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sug)}
                  className="w-full text-left p-2 rounded-md bg-surface-subtle/40 hover:bg-surface-subtle text-[11px] text-slate-300 transition-colors border border-surface-border/40 truncate block"
                >
                  ✨ {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Execute Agent Button */}
          <Button
            id="execute-agent-btn"
            onClick={handleExecuteAgent}
            variant="primary"
            className="w-full py-2.5 shadow-lg shadow-brand-600/30"
            isLoading={isExecuting}
            leftIcon={<Play className="w-4 h-4 fill-current" />}
          >
            {isExecuting ? 'Orchestrating AI Agents...' : 'Execute Multi-Agent Workflow'}
          </Button>
        </Card>

        {/* Task History Sidebar */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Agent Task History
            </h4>
            <span className="text-[10px] font-mono text-slate-500">{taskHistory.length} tasks</span>
          </div>

          {isLoadingHistory ? (
            <p className="text-xs text-slate-400 text-center py-4">Loading agent task history...</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {taskHistory.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setCurrentTask(t)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    currentTask?.id === t.id
                      ? 'bg-brand-600/20 border-brand-500/50 text-slate-100'
                      : 'bg-surface-subtle/30 border-surface-border/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 capitalize font-mono text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                      {t.role} Agent
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{t.prompt}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Right Column: Workflow Steps & Generated Patch View */}
      <div className="lg:col-span-7 space-y-6">
        {currentTask ? (
          <div className="space-y-6">
            {/* Active Workflow Header */}
            <Card className="space-y-4 bg-gradient-to-r from-surface to-surface-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">Workflow Task Execution</h3>
                    <Badge variant="success" className="uppercase font-mono text-[10px]">
                      {currentTask.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-1">"{currentTask.prompt}"</p>
                </div>
                {currentTask.generatedPatch && (
                  <Button
                    id="apply-patch-btn"
                    onClick={handleApplyPatch}
                    variant={currentTask.isApplied ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={currentTask.isApplied}
                    isLoading={isApplyingPatch}
                    leftIcon={currentTask.isApplied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
                  >
                    {currentTask.isApplied ? 'Patch Applied to Workspace' : 'Apply Patch to Workspace'}
                  </Button>
                )}
              </div>

              {/* Multi-Agent Steps List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Multi-Agent Workflow Execution Log</h4>
                <div className="space-y-2.5">
                  {currentTask.steps?.map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className="bg-surface-subtle/70 border border-surface-border/70 rounded-xl p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 pl-6 leading-relaxed">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Code Patch Diff Card */}
            {currentTask.generatedPatch && (
              <Card className="p-0 overflow-hidden border border-surface-border">
                <div className="h-10 bg-surface-subtle px-4 border-b border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
                    <FileCode className="w-4 h-4 text-brand-accent" />
                    <span>{currentTask.generatedPatch.filePath}</span>
                    <span className="text-[10px] text-slate-500 font-sans uppercase">(AI Generated Patch)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDiffTab('new')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                        activeDiffTab === 'new' ? 'bg-brand-600/30 text-brand-accent font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Patched Code
                    </button>
                    <button
                      onClick={() => setActiveDiffTab('original')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                        activeDiffTab === 'original' ? 'bg-surface-border text-slate-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Original Base
                    </button>
                  </div>
                </div>

                <div className="bg-[#0B0D10] p-4 font-mono text-xs overflow-x-auto max-h-96">
                  <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeDiffTab === 'new'
                      ? currentTask.generatedPatch.newContent
                      : currentTask.generatedPatch.originalContent || '// No original content stored'}
                  </pre>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="text-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center mx-auto text-brand-accent">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 text-sm">No Active Agent Workflow</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select an agent role and enter a task objective on the left panel to execute multi-agent code analysis and patch generation.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
