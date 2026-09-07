import React, { useState, useEffect } from 'react';
import { Github, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RepoSelector } from './RepoSelector';
import { githubService } from '../../services/github.service';

export const GithubConnectModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRepos();
    }
  }, [isOpen]);

  const loadRepos = async () => {
    setIsLoading(true);
    try {
      const repos = await githubService.listRepositories();
      setRepositories(repos);
      if (repos.length > 0) {
        setSelectedRepo(repos[0]);
      }
    } catch (err) {
      console.error('Failed to load GitHub repos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectOAuth = async () => {
    try {
      const authUrl = await githubService.getAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (err) {
      alert('Failed to trigger GitHub OAuth flow');
    }
  };

  const handleImport = async () => {
    if (!selectedRepo) return;
    setIsImporting(true);
    try {
      const importedProj = await githubService.importRepository({
        name: selectedRepo.name,
        description: selectedRepo.description || `Imported from ${selectedRepo.fullName}`,
        repositoryUrl: selectedRepo.htmlUrl,
        githubRepoId: selectedRepo.id.toString(),
        githubFullName: selectedRepo.fullName,
        isPrivateRepo: selectedRepo.private,
        branch: selectedRepo.defaultBranch,
        framework: selectedRepo.language === 'TypeScript' ? 'express' : 'react',
      });
      onImportSuccess(importedProj);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to import GitHub repository');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import GitHub Repository Workspace">
      <div className="space-y-5">
        {/* Banner */}
        <div className="bg-surface-subtle border border-surface-border rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Connect GitHub Account</p>
              <p className="text-slate-400 text-[11px]">Sync public &amp; private repositories for AI indexing</p>
            </div>
          </div>
          <Button onClick={handleConnectOAuth} variant="outline" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-accent" />}>
            OAuth Connect
          </Button>
        </div>

        {/* Repository Selection */}
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading GitHub repositories...</div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Select Repository to Import</label>
            <RepoSelector
              repositories={repositories}
              selectedRepo={selectedRepo}
              onSelectRepo={setSelectedRepo}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <Badge variant="info">₹0 COST INTEGRATION</Badge>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              isLoading={isImporting}
              disabled={!selectedRepo}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Import Workspace
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
