import React, { useState } from 'react';
import { Search, FileCode, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { codeService } from '../../services/code.service';

export const CodeSearchPanel = ({ projectId, onSelectMatch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const matches = await codeService.searchCode(projectId, query);
      setResults(matches);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-surface border-l border-surface-border w-80 flex flex-col h-full overflow-hidden text-xs">
      <div className="p-3 border-b border-surface-border font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
        <span>SEARCH CODE</span>
        <span className="font-mono text-[10px] text-slate-500">{results.length} MATCHES</span>
      </div>

      <form onSubmit={handleSearch} className="p-3 border-b border-surface-border">
        <Input
          placeholder="Search query (e.g. jwt, loginUser)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </form>

      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {isSearching ? (
          <p className="text-slate-400 text-center py-8">Searching codebase...</p>
        ) : results.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Enter a query to search across workspace files.</p>
        ) : (
          results.map((match, idx) => (
            <div
              key={`${match.filePath}-${match.lineNumber}-${idx}`}
              onClick={() => onSelectMatch(match.filePath, match.lineNumber)}
              className="p-2.5 rounded-lg border border-surface-border bg-surface-subtle/60 hover:bg-surface-hover hover:border-brand-500/40 cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-300">
                <span className="truncate flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  {match.filePath}
                </span>
                <span className="text-slate-500 font-bold shrink-0">L{match.lineNumber}</span>
              </div>
              <p className="font-mono text-[10px] text-slate-400 line-clamp-2 bg-background p-1.5 rounded border border-surface-border/50">
                {match.lineContent}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
