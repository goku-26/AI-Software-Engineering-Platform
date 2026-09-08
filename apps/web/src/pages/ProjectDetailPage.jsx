import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  CheckCircle,
  ShieldCheck,
  Zap,
  GitBranch,
  Activity,
  Terminal,
  Code2,
  FileCode,
  Sparkles,
  ArrowLeft,
  Trash2,
  Github,
  Save,
  Search,
  Maximize2,
  Network,
  Server,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FileExplorer } from '../components/code/FileExplorer';
import { CodeEditor } from '../components/code/CodeEditor';
import { CodeSearchPanel } from '../components/code/CodeSearchPanel';
import { AgentPanel } from '../components/agent/AgentPanel';
import { TestRunnerPanel } from '../components/test/TestRunnerPanel';
import { SecurityScanPanel } from '../components/security/SecurityScanPanel';
import { GitDeliveryPanel } from '../components/git/GitDeliveryPanel';
import { ObservabilityPanel } from '../components/observability/ObservabilityPanel';
import { DependencyGraphPanel } from '../components/dependency/DependencyGraphPanel';
import { InfrastructurePanel } from '../components/infrastructure/InfrastructurePanel';
import { projectService } from '../services/project.service';
import { codeService } from '../services/code.service';


export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('understand'); // Default to Code IDE view

  // Code Workspace State
  const [fileTree, setFileTree] = useState([]);
  const [activeFilePath, setActiveFilePath] = useState('src/controllers/authController.js');
  const [activeFileContent, setActiveFileContent] = useState('');
  const [activeFileLanguage, setActiveFileLanguage] = useState('javascript');
  const [isSaving, setIsSaving] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchProjectAndCode = async () => {
      try {
        const data = await projectService.getProjectById(id);
        setProject(data);

        // Fetch file tree
        const tree = await codeService.getFileTree(id);
        setFileTree(tree);

        // Fetch initial file
        const fileData = await codeService.getFileContent(id, 'src/controllers/authController.js');
        setActiveFileContent(fileData.content);
        setActiveFileLanguage(fileData.language || 'javascript');
      } catch (err) {
        console.error('Failed to load project or code:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectAndCode();
  }, [id]);

  const handleSelectFile = async (filePath) => {
    setActiveFilePath(filePath);
    try {
      const fileData = await codeService.getFileContent(id, filePath);
      setActiveFileContent(fileData.content);
      setActiveFileLanguage(fileData.language || 'javascript');
    } catch (err) {
      console.error('Failed to read file:', err);
    }
  };

  const handleSaveFile = async () => {
    if (!id || !activeFilePath) return;
    setIsSaving(true);
    try {
      await codeService.saveFileContent(id, activeFilePath, activeFileContent);
    } catch (err) {
      alert('Failed to save file: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this project workspace?')) return;
    try {
      await projectService.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  if (isLoading) {
    return <Card className="text-center py-12 text-slate-400">Loading project workspace &amp; codebase...</Card>;
  }

  if (!project) {
    return (
      <Card className="text-center py-12 space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Project Not Found</h3>
        <Button onClick={() => navigate('/projects')} variant="primary" size="sm">
          Return to Projects
        </Button>
      </Card>
    );
  }

  const tabs = [
    { id: 'understand', label: 'Code & IDE Workspace', icon: Code2 },
    { id: 'overview', label: 'Overview', icon: FolderGit2 },
    { id: 'debug', label: 'Debug Agent', icon: Zap },
    { id: 'tests', label: 'Test Suite', icon: CheckCircle },
    { id: 'security', label: 'Security Scan', icon: ShieldCheck },
    { id: 'git', label: 'Git & Delivery', icon: GitBranch },
    { id: 'observability', label: 'AI Observability', icon: Activity },
    { id: 'dependency', label: 'Monorepo & Dependencies', icon: Network },
    { id: 'infrastructure', label: 'Cloud & Infrastructure', icon: Server },
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/projects')} variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{project.name}</h1>
              <Badge variant="info" className="uppercase font-mono">
                {project.framework}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{project.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowSearchPanel(!showSearchPanel)}
            variant={showSearchPanel ? 'secondary' : 'outline'}
            size="sm"
            leftIcon={<Search className="w-4 h-4" />}
          >
            {showSearchPanel ? 'Close Search' : 'Search Code'}
          </Button>
          <Button onClick={handleDelete} variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete Workspace
          </Button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-surface-border shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-brand-500 text-brand-accent bg-surface-subtle/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-surface-subtle/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* IDE Code Workspace View */}
      {activeTab === 'understand' && (
        <div className="flex-1 flex bg-surface border border-surface-border rounded-xl overflow-hidden min-h-0">
          {/* File Explorer Tree */}
          <FileExplorer
            tree={fileTree}
            activeFile={activeFilePath}
            onSelectFile={handleSelectFile}
          />

          {/* Editor Container */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0B0D10]">
            {/* Open Tab Header */}
            <div className="h-10 bg-surface-subtle border-b border-surface-border px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-200">
                <FileCode className="w-4 h-4 text-brand-accent" />
                <span>{activeFilePath || 'Select a file'}</span>
                <span className="text-[10px] text-slate-500 font-sans uppercase">({activeFileLanguage})</span>
              </div>
              <Button
                onClick={handleSaveFile}
                variant="primary"
                size="sm"
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save File
              </Button>
            </div>

            {/* Monaco Editor Component */}
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={activeFileContent}
                language={activeFileLanguage}
                onChange={(newVal) => setActiveFileContent(newVal || '')}
              />
            </div>
          </div>

          {/* Optional Code Search Panel */}
          {showSearchPanel && (
            <CodeSearchPanel
              projectId={id}
              onSelectMatch={(filePath) => handleSelectFile(filePath)}
            />
          )}
        </div>
      )}

      {/* Overview Tab View */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          <Card className="space-y-4">
            <h3 className="font-semibold text-slate-200 text-sm">Workspace Metadata</h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-surface-border">
                <span className="text-slate-400">Branch</span>
                <span className="text-slate-200 flex items-center gap-1 font-mono">
                  <GitBranch className="w-3 h-3 text-slate-500" />
                  {project.branch}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border">
                <span className="text-slate-400">GitHub Sync</span>
                <span className="text-slate-200 font-mono flex items-center gap-1">
                  <Github className="w-3 h-3 text-brand-accent" />
                  {project.githubFullName || (project.repositoryUrl ? 'Connected' : 'Local Workspace')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-bold uppercase">{project.status}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Indexed Files</span>
                <span className="text-slate-200">{project.fileCount}</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-accent" />
                Phase 3 Codebase Engine Active
              </h3>
              <Badge variant="success">AST &amp; MONACO READY</Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monaco Code Editor, AST File Scanner, and Regex Code Search are live in this workspace. Switch to the <strong>Code &amp; IDE Workspace</strong> tab above to browse the directory tree, edit files, and run code search queries.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-surface-subtle p-3 rounded-lg text-center border border-surface-border">
                <span className="text-[10px] text-slate-400 font-mono">TEST HEALTH</span>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">{project.testHealthScore}%</p>
              </div>
              <div className="bg-surface-subtle p-3 rounded-lg text-center border border-surface-border">
                <span className="text-[10px] text-slate-400 font-mono">SECURITY SCORE</span>
                <p className="text-lg font-bold text-cyan-400 font-mono mt-1">{project.securityScore}%</p>
              </div>
              <div className="bg-surface-subtle p-3 rounded-lg text-center border border-surface-border">
                <span className="text-[10px] text-slate-400 font-mono">CODE QUALITY</span>
                <p className="text-lg font-bold text-indigo-400 font-mono mt-1">{project.codeQualityScore}%</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'debug' && (
        <div className="flex-1 min-h-0">
          <AgentPanel
            projectId={id}
            onPatchApplied={(filePath) => {
              if (filePath) handleSelectFile(filePath);
            }}
          />
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="flex-1 min-h-0">
          <TestRunnerPanel
            projectId={id}
            onTestSaved={(filePath) => {
              if (filePath) handleSelectFile(filePath);
            }}
          />
        </div>
      )}

      {activeTab === 'security' && (
        <div className="flex-1 min-h-0">
          <SecurityScanPanel
            projectId={id}
            onPatchApplied={(filePath) => {
              if (filePath) handleSelectFile(filePath);
            }}
          />
        </div>
      )}

      {activeTab === 'git' && (
        <div className="flex-1 min-h-0">
          <GitDeliveryPanel projectId={id} />
        </div>
      )}

      {activeTab === 'observability' && (
        <div className="flex-1 min-h-0">
          <ObservabilityPanel projectId={id} />
        </div>
      )}

      {activeTab === 'dependency' && (
        <div className="flex-1 min-h-0">
          <DependencyGraphPanel projectId={id} />
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="flex-1 min-h-0">
          <InfrastructurePanel projectId={id} />
        </div>
      )}

      {activeTab !== 'understand' && activeTab !== 'overview' && activeTab !== 'debug' && activeTab !== 'tests' && activeTab !== 'security' && activeTab !== 'git' && activeTab !== 'observability' && activeTab !== 'dependency' && activeTab !== 'infrastructure' && (
        <Card className="text-center py-16 space-y-3">
          <Badge variant="info">PHASE 10 ENTERPRISE ENGINE ACTIVE</Badge>
          <h3 className="text-lg font-semibold text-slate-200 uppercase tracking-wide">{activeTab} MODULE</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {activeTab} module will connect in upcoming implementation phases.
          </p>
        </Card>
      )}


    </div>
  );
};
