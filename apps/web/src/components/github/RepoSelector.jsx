import React, { useState } from 'react';
import { Search, GitBranch, Lock, Globe, Check } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export const RepoSelector = ({ repositories, selectedRepo, onSelectRepo }) => {
  const [search, setSearch] = useState('');

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <Input
        placeholder="Filter your GitHub repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-surface-border rounded-xl p-2 bg-surface-subtle/50">
        {filteredRepos.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No matching GitHub repositories found.</p>
        ) : (
          filteredRepos.map((repo) => {
            const isSelected = selectedRepo?.id === repo.id;
            return (
              <div
                key={repo.id}
                onClick={() => onSelectRepo(repo)}
                className={`p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-600/10 text-white'
                    : 'border-surface-border bg-surface/70 hover:bg-surface-hover text-slate-300'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    {repo.private ? (
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-200 truncate">{repo.fullName}</span>
                  </div>
                  {repo.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-1">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                    {repo.language && (
                      <span className="text-slate-400 font-mono">{repo.language}</span>
                    )}
                    <span className="flex items-center gap-1 font-mono">
                      <GitBranch className="w-3 h-3" /> {repo.defaultBranch}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
