import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  CheckCircle,
  ShieldCheck,
  Zap,
  Plus,
  ArrowUpRight,
  Activity,
  Code2,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { projectService } from '../services/project.service';

export const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.listProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const stats = [
    { label: 'Active Projects', value: projects.length.toString(), icon: FolderGit2, change: '+1 this week' },
    { label: 'AI Tasks Completed', value: '42', icon: Cpu, change: '100% success rate' },
    { label: 'Test Health Score', value: '98%', icon: CheckCircle, change: '387 tests passing' },
    { label: 'Security Score', value: '94%', icon: ShieldCheck, change: '0 critical vulnerabilities' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-subtle p-6 rounded-2xl border border-surface-border">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            DevForge AI is active and monitoring repository context, automated test execution, and security models.
          </p>
        </div>
        <Button onClick={() => navigate('/projects')} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 text-brand-accent flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white font-mono">{stat.value}</span>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>{stat.change}</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Projects & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-brand-accent" />
              Recent Workspaces
            </h2>
            <Button onClick={() => navigate('/projects')} variant="ghost" size="sm">
              View All
            </Button>
          </div>

          {isLoading ? (
            <Card className="text-center py-12 text-slate-400 text-sm">Loading projects...</Card>
          ) : projects.length === 0 ? (
            <Card className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center mx-auto text-slate-400">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">No Projects Found</h3>
                <p className="text-xs text-slate-400 mt-1">Create or import your first software project to begin AI analysis.</p>
              </div>
              <Button onClick={() => navigate('/projects')} variant="primary" size="sm">
                Create Project
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="bg-surface/80 border border-surface-border rounded-xl p-4 glass-panel-hover flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-surface-subtle flex items-center justify-center text-brand-accent font-bold text-xs uppercase border border-surface-border">
                      {project.framework?.slice(0, 2) || 'PR'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm hover:text-brand-accent transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
                      {project.status.toUpperCase()}
                    </Badge>
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Agent Activity Log */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            AI Agent Activity
          </h2>
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-surface-border bg-surface-subtle/50 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>LIVE ORCHESTRATION</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE
              </span>
            </div>
            <div className="p-4 space-y-4 text-xs font-mono">
              <div className="flex gap-3 items-start">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-semibold">Architect Agent initialized</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Parsed repo file structure &amp; generated system plan</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-semibold">Coding Agent patched authController.js</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Updated login request payload verification</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-400 font-semibold">Test Agent verified test suite</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">14/14 unit tests passed cleanly</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
