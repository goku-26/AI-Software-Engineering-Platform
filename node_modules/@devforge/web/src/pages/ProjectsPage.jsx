import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, Plus, Search, GitBranch, ArrowRight, Code2, Github } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { GithubConnectModal } from '../components/github/GithubConnectModal';
import { projectService } from '../services/project.service';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  // New Project Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [framework, setFramework] = useState('express');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.listProjects(search);
      setProjects(data);
    } catch (err) {
      console.error('Failed to list projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [search]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const newProj = await projectService.createProject({
        name,
        description,
        repositoryUrl,
        branch,
        framework,
      });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setRepositoryUrl('');
      loadProjects();
      navigate(`/projects/${newProj.id}`);
    } catch (err) {
      alert(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Software Projects</h1>
          <p className="text-sm text-slate-400">Manage and connect software codebases for AI agent operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsGithubModalOpen(true)} variant="secondary" leftIcon={<Github className="w-4 h-4" />}>
            Import GitHub Repo
          </Button>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Project
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="max-w-md">
        <Input
          placeholder="Search projects by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Grid of Projects */}
      {isLoading ? (
        <Card className="text-center py-12 text-slate-400 text-sm">Loading projects...</Card>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center mx-auto text-slate-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">No Projects Found</h3>
            <p className="text-xs text-slate-400 mt-1">Get started by creating your first DevForge project workspace.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
            Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              hoverable
              className="flex flex-col justify-between"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info" className="uppercase font-mono">
                    {project.framework}
                  </Badge>
                  <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-brand-accent transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                  {project.branch || 'main'}
                </span>
                <span className="flex items-center gap-1 text-brand-accent font-medium">
                  Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New DevForge Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="DevForge Auth Service"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Description"
            placeholder="MERN authentication & user profile microservice"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Repository URL (Optional)"
            placeholder="https://github.com/org/repo"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Branch"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full bg-surface-subtle border border-surface-border text-slate-100 rounded-lg text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              >
                <option value="express">Express.js</option>
                <option value="react">React</option>
                <option value="nextjs">Next.js</option>
                <option value="node">Node.js</option>
                <option value="python">Python</option>
                <option value="unknown">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
      {/* GitHub Connect Modal */}
      <GithubConnectModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        onImportSuccess={(newProj) => {
          loadProjects();
          if (newProj?.id) navigate(`/projects/${newProj.id}`);
        }}
      />
    </div>
  );
};
