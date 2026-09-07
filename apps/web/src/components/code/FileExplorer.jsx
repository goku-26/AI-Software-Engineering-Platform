import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileText, ChevronRight, ChevronDown } from 'lucide-react';

const FileTreeNode = ({ node, activeFile, onSelectFile, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  const isDirectory = node.type === 'directory';
  const isSelected = activeFile === node.path;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div className="select-none text-xs">
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        className={`flex items-center gap-2 py-1 px-2 rounded-md transition-colors cursor-pointer ${
          isSelected
            ? 'bg-brand-600/20 text-brand-accent font-semibold border border-brand-500/30'
            : 'text-slate-300 hover:bg-surface-hover hover:text-white'
        }`}
      >
        {isDirectory ? (
          <>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
            {isOpen ? <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" /> : <Folder className="w-4 h-4 text-amber-400 shrink-0" />}
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5 shrink-0" />
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer = ({ tree, activeFile, onSelectFile }) => {
  return (
    <div className="bg-surface border-r border-surface-border w-64 flex flex-col h-full overflow-hidden select-none">
      <div className="p-3 border-b border-surface-border text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
        <span>EXPLORER</span>
        <span className="font-mono text-[10px] text-slate-500">PROJECT FILES</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto space-y-0.5">
        {tree && tree.length > 0 ? (
          tree.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
            />
          ))
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No files scanned in workspace.</p>
        )}
      </div>
    </div>
  );
};
