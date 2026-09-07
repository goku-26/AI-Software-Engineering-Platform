import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FolderGit2,
  Terminal,
  ShieldAlert,
  Settings,
  LogOut,
  Cpu,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
  ];

  return (
    <div className="min-h-screen bg-background flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-surface/90 border-r border-surface-border flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-surface-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">DevForge</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-accent font-mono">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide">ENGINEERING PLATFORM</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-100 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-accent' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-surface-border space-y-3">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-subtle/60 rounded-lg border border-surface-border/50">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-brand-600/30 text-brand-accent flex items-center justify-center font-bold text-xs">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Developer'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-surface/50 border-b border-surface-border px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Badge variant="info" className="gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Phase 5 — Automated Test Engine</span>
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Provider: <strong className="text-slate-200 font-mono">Local / Demo</strong>
            </span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
