import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Cpu, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setEmail('demo.developer@devforge.ai');
      setPassword('DevForgeDemo2026!');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo.developer@devforge.ai');
    setPassword('DevForgeDemo2026!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-brand-500/30">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center mx-auto shadow-xl shadow-brand-500/20">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to DevForge AI</h2>
          <p className="text-slate-400 text-sm">Enter your developer credentials to access your workspaces</p>
        </div>

        {/* Demo Notification Banner */}
        <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-brand-accent">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Want to explore instantly?</span>
          </div>
          <button
            onClick={fillDemoCredentials}
            type="button"
            className="text-white font-medium hover:underline cursor-pointer bg-brand-600/30 px-2.5 py-1 rounded border border-brand-500/40"
          >
            Auto-fill Demo Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="developer@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Sign In
          </Button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-accent font-medium hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
