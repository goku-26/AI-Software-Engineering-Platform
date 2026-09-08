import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  Rocket,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  ArrowRight,
  Code2,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { gitService } from '../../services/git.service';

export const GitDeliveryPanel = ({ projectId }) => {
  const [branches, setBranches] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newBranchName, setNewBranchName] = useState('auth-verification-guard');
  const [newBranchCommitMsg, setNewBranchCommitMsg] = useState('feat(auth): add strict payload validation guard');

  const [prTitle, setPrTitle] = useState('feat(auth): Add JWT Auth & CWE Security Remediation');
  const [prSourceBranch, setPrSourceBranch] = useState('devforge/task/jwt-auth-upgrade');
  const [prBody, setPrBody] = useState('Automated Pull Request created by DevForge AI Platform containing verified multi-agent code transformations and Vitest test suite.');

  const [activePRs, setActivePRs] = useState([
    {
      prId: 'pr_demo_01',
      prNumber: 14,
      title: 'feat(auth): Add JWT payload validation and expiration handling',
      body: 'Automated Pull Request created by DevForge AI Platform.',
      sourceBranch: 'devforge/task/jwt-auth-upgrade',
      targetBranch: 'main',
      status: 'open',
      htmlUrl: 'https://github.com/devforge-ai/workspace/pull/14',
      diffSummary: { filesChanged: 2, additions: 42, deletions: 8 },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  useEffect(() => {
    if (!projectId) return;
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [branchList, pipelineList] = await Promise.all([
        gitService.getBranches(projectId),
        gitService.getPipelines(projectId),
      ]);
      setBranches(branchList);
      setPipelines(pipelineList);
    } catch (err) {
      console.error('Failed to fetch Git delivery data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBranch = async (e) => {
    if (e) e.preventDefault();
    if (!newBranchName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await gitService.createBranch(projectId, {
        name: newBranchName.trim(),
        commitMessage: newBranchCommitMsg.trim(),
        baseBranch: 'main',
      });
      setBranches((prev) => [created, ...prev]);
      setIsBranchModalOpen(false);
      setNewBranchName('');
    } catch (err) {
      alert('Failed to create isolated task branch: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePR = async (e) => {
    if (e) e.preventDefault();
    if (!prTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const pr = await gitService.createPR(projectId, {
        title: prTitle.trim(),
        body: prBody.trim(),
        sourceBranch: prSourceBranch,
        targetBranch: 'main',
      });
      setActivePRs((prev) => [pr, ...prev]);
      setIsPRModalOpen(false);
    } catch (err) {
      alert('Failed to create pull request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerPipeline = async (environment = 'staging') => {
    setIsLoading(true);
    try {
      const run = await gitService.triggerPipeline(projectId, {
        branch: branches[0]?.name || 'main',
        environment,
      });
      setPipelines((prev) => [run, ...prev]);
    } catch (err) {
      alert('Failed to trigger continuous delivery pipeline: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-surface to-surface-subtle p-6 rounded-2xl border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/40 text-brand-accent flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-500/10">
            <GitBranch className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Isolated Git &amp; Continuous Delivery Engine</h2>
              <Badge variant="info" className="uppercase font-mono text-[10px]">
                Phase 7 Engine Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated task branch isolation (<code className="font-mono text-brand-accent">devforge/task/*</code>), GitHub PR generation, and CD deployment staging.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            id="create-task-branch-btn"
            onClick={() => setIsBranchModalOpen(true)}
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Task Branch
          </Button>
          <Button
            id="create-pull-request-btn"
            onClick={() => setIsPRModalOpen(true)}
            variant="primary"
            size="sm"
            className="shadow-lg shadow-brand-600/30"
            leftIcon={<GitPullRequest className="w-4 h-4" />}
          >
            Create Pull Request
          </Button>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-surface/80 border-surface-border">
          <span className="text-[11px] font-medium text-slate-400">Isolated Task Branches</span>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{branches.length}</p>
        </Card>
        <Card className="p-4 bg-surface/80 border-surface-border">
          <span className="text-[11px] font-medium text-slate-400">Open Pull Requests</span>
          <p className="text-2xl font-bold text-brand-accent font-mono mt-1">{activePRs.length}</p>
        </Card>
        <Card className="p-4 bg-surface/80 border-surface-border">
          <span className="text-[11px] font-medium text-slate-400">Pipeline Status</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SUCCESS
          </p>
        </Card>
        <Card className="p-4 bg-surface/80 border-surface-border">
          <span className="text-[11px] font-medium text-slate-400">Delivery Target</span>
          <p className="text-sm font-bold text-cyan-400 font-mono mt-1 truncate">
            {pipelines[0]?.environment || 'staging'} (Live)
          </p>
        </Card>
      </div>

      {/* Main Grid: Branches & Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Isolated Task Branches */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-brand-accent" />
                Active Isolated Task Branches ({branches.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-400">BASE: main</span>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-400 text-center py-6">Loading isolated git branches...</p>
            ) : branches.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No active task branches. Click "New Task Branch" to isolate changes.</p>
            ) : (
              <div className="space-y-3">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="bg-surface-subtle/50 border border-surface-border/80 rounded-xl p-4 space-y-2.5 hover:border-surface-border transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                        <h4 className="text-xs font-bold text-slate-100 font-mono">{b.name}</h4>
                        <Badge variant="neutral" className="font-mono text-[10px]">
                          from {b.baseBranch}
                        </Badge>
                      </div>

                      {b.prUrl ? (
                        <a
                          href={b.prUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-accent hover:underline"
                        >
                          PR #{b.prNumber} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Button
                          id={`branch-pr-btn-${b.id}`}
                          onClick={() => {
                            setPrSourceBranch(b.name);
                            setIsPRModalOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          leftIcon={<GitPullRequest className="w-3 h-3" />}
                        >
                          Create PR
                        </Button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-mono bg-[#080B10] p-2 rounded-lg border border-surface-border/50">
                      💬 {b.commitMessage}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-slate-500" />
                        Modified Files: <strong className="text-slate-200">{b.modifiedFiles?.join(', ') || '1 file'}</strong>
                      </span>
                      <span className="font-mono text-[10px]">
                        {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Pull Requests Section */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                Active Pull Requests ({activePRs.length})
              </h3>
            </div>

            <div className="space-y-3">
              {activePRs.map((pr) => (
                <div
                  key={pr.prId}
                  className="bg-surface-subtle/50 border border-emerald-500/30 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="font-mono uppercase text-[10px]">
                        OPEN PR #{pr.prNumber}
                      </Badge>
                      <h4 className="text-xs font-semibold text-slate-200">{pr.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">+{pr.diffSummary.additions} -{pr.diffSummary.deletions}</span>
                  </div>

                  <p className="text-xs text-slate-400 pl-1">{pr.body}</p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-surface-border/40">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-brand-accent" />
                      {pr.sourceBranch} <ArrowRight className="w-3 h-3 text-slate-500" /> {pr.targetBranch}
                    </span>
                    <a
                      href={pr.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-accent hover:underline flex items-center gap-1 text-[10px]"
                    >
                      View on GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Continuous Delivery Pipelines */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-cyan-400" />
                Continuous Delivery Pipelines
              </h3>

              <Button
                id="trigger-delivery-build-btn"
                onClick={() => handleTriggerPipeline('staging')}
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-cyan-400" />}
              >
                Trigger Build
              </Button>
            </div>

            <div className="space-y-3">
              {pipelines.map((pipe) => (
                <div
                  key={pipe.id}
                  className="bg-surface-subtle/50 border border-surface-border/70 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      [{pipe.environment.toUpperCase()}] Commit {pipe.commitHash}
                    </span>
                    <Badge variant="success" className="uppercase font-mono text-[10px]">
                      {pipe.status}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-300 font-mono line-clamp-1">{pipe.commitMessage}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Build time: {pipe.buildDurationMs}ms
                    </span>

                    {pipe.deployedUrl && (
                      <a
                        href={pipe.deployedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        Staging App <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Create Task Branch */}
      <Modal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        title="Create Isolated Task Branch"
      >
        <form onSubmit={handleCreateBranch} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Task Branch Name</label>
            <Input
              id="new-branch-name-input"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="e.g. task/auth-jwt-guard"
              required
            />
            <span className="text-[10px] text-slate-400 font-mono">
              Branch name will be formatted as <code className="text-brand-accent">devforge/task/{newBranchName}</code>
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Initial Commit Message</label>
            <Input
              id="new-branch-commit-input"
              value={newBranchCommitMsg}
              onChange={(e) => setNewBranchCommitMsg(e.target.value)}
              placeholder="feat(auth): initial isolation branch"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsBranchModalOpen(false)}>
              Cancel
            </Button>
            <Button
              id="submit-create-branch-btn"
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create Isolated Branch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Pull Request */}
      <Modal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        title="Create GitHub Pull Request"
      >
        <form onSubmit={handleCreatePR} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Pull Request Title</label>
            <Input
              id="new-pr-title-input"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              placeholder="feat(auth): Add JWT validation and security patch"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Source Task Branch</label>
            <select
              id="new-pr-source-select"
              value={prSourceBranch}
              onChange={(e) => setPrSourceBranch(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border text-slate-100 rounded-lg text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Pull Request Description</label>
            <textarea
              rows={3}
              value={prBody}
              onChange={(e) => setPrBody(e.target.value)}
              className="w-full p-3 bg-surface-subtle border border-surface-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsPRModalOpen(false)}>
              Cancel
            </Button>
            <Button
              id="submit-create-pr-btn"
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create GitHub PR
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
