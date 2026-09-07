import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Terminal,
  ShieldCheck,
  Zap,
  GitBranch,
  Search,
  CheckCircle2,
  ArrowRight,
  Code2,
  Bug,
  LineChart,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login?demo=true');
    }
  };

  const featureCards = [
    {
      title: 'Codebase Intelligence',
      description: 'AST parsing, language detection, dependency analysis, and semantic code search across large repositories.',
      icon: Search,
    },
    {
      title: 'Autonomous Agents',
      description: 'Architect, Coding, Debug, Test, Security, and Review agents working in coordinated tool orchestration.',
      icon: Cpu,
    },
    {
      title: 'Generate → Test → Fix Loop',
      description: 'Automated test suite execution with self-healing debug iteration up to strict verification limits.',
      icon: Zap,
    },
    {
      title: 'Isolated Git Workflow',
      description: 'Every AI edit occurs on an isolated task branch with full diff preview before human approval.',
      icon: GitBranch,
    },
    {
      title: 'Security Audits',
      description: 'In-depth code vulnerability identification, JWT state checks, and strict sandbox execution constraints.',
      icon: ShieldCheck,
    },
    {
      title: 'AI Observability',
      description: 'Comprehensive token cost tracking, tool call logging, latency metrics, and evaluation benchmarks.',
      icon: LineChart,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-brand-500/30">
      {/* Header Navigation */}
      <header className="border-b border-surface-border bg-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white">DevForge AI</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-accent font-mono">v1.0</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Button onClick={() => navigate('/register')} variant="primary">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/10 border border-brand-500/30 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-8 mx-auto">
          <SparklesIcon /> AI Software Engineering Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
          Build Software With AI.{' '}
          <span className="gradient-text">Understand. Build. Debug. Test. Ship.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          DevForge AI connects to your codebase, plans engineering tasks, generates changes, runs tests, diagnoses failures, and helps developers ship safer code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button onClick={() => navigate('/register')} variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Get Started Free
          </Button>
          <Button onClick={handleDemoClick} variant="secondary" size="lg" leftIcon={<Code2 className="w-5 h-5" />}>
            Try DevForge Demo
          </Button>
        </div>

        {/* Console Workflow Preview */}
        <div className="max-w-4xl mx-auto w-full bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden text-left">
          <div className="px-4 py-3 bg-surface-subtle border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-mono text-xs text-slate-400">devforge-orchestrator — agent task #104</span>
            </div>
            <Badge variant="info">AUTONOMOUS LOOP</Badge>
          </div>
          <div className="p-6 font-mono text-sm space-y-3 bg-[#080B10] text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-brand-accent">✦ USER:</span>
              <span className="text-slate-100">"Add JWT authentication and verify user registration flow."</span>
            </div>
            <div className="flex items-start gap-3 text-slate-400">
              <span className="text-indigo-400">⚡ PLANNER:</span>
              <span>Scanning dependencies &amp; authController.js → Created 4 implementation steps.</span>
            </div>
            <div className="flex items-start gap-3 text-slate-400">
              <span className="text-emerald-400">✓ TESTER:</span>
              <span>Generated 12 unit tests in tests/auth.test.js</span>
            </div>
            <div className="flex items-start gap-3 text-slate-400">
              <span className="text-amber-400">⚠ DEBUGGER:</span>
              <span>Test failure detected (missing password salt) → Auto-repair patch generated.</span>
            </div>
            <div className="flex items-start gap-3 text-emerald-400 font-semibold">
              <span>SUCCESS:</span>
              <span>All 12 tests passed cleanly (0.42s). Git branch devforge/task/jwt ready for review.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-surface/40 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Controlled AI Engineering Architecture</h2>
            <p className="text-slate-400 text-sm">
              DevForge AI operates through controlled developer tools and isolated sandboxes, never unrestricted prompt execution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-surface/80 border border-surface-border rounded-xl p-6 glass-panel-hover">
                  <div className="w-10 h-10 rounded-lg bg-brand-600/20 text-brand-accent flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 text-center text-xs text-slate-500 bg-background">
        <p>© 2026 DevForge AI. Production AI Software Engineering Platform.</p>
      </footer>
    </div>
  );
};

const SparklesIcon = () => (
  <svg className="w-3.5 h-3.5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
