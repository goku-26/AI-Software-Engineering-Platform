import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  Clock,
  FileCode,
  Save,
  Check,
  Activity,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { testService } from '../../services/test.service';

export const TestRunnerPanel = ({ projectId, onTestSaved }) => {
  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'generate'
  const [latestRun, setLatestRun] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'passed' | 'failed'

  // Generator state
  const [targetFile, setTargetFile] = useState('src/controllers/authController.js');
  const [testType, setTestType] = useState('unit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetchHistory();
  }, [projectId]);

  const fetchHistory = async () => {
    try {
      const history = await testService.getHistory(projectId);
      if (history && history.length > 0) {
        setLatestRun(history[0]);
      }
    } catch (err) {
      console.error('Failed to fetch test run history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRunTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const run = await testService.runTests(projectId);
      setLatestRun(run);
    } catch (err) {
      alert('Failed to run test suite: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGenerateTest = async (e) => {
    if (e) e.preventDefault();
    if (isGenerating || !targetFile.trim()) return;

    setIsGenerating(true);
    setIsSaved(false);
    try {
      const res = await testService.generateUnitTest(projectId, {
        filePath: targetFile.trim(),
        testType,
      });
      setGeneratedResult(res);
    } catch (err) {
      alert('Failed to generate unit test: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTest = async () => {
    if (!generatedResult || isSaving || isSaved) return;
    setIsSaving(true);
    try {
      await testService.saveUnitTest(projectId, {
        filePath: generatedResult.testFilePath,
        testCode: generatedResult.generatedTestCode,
      });
      setIsSaved(true);
      if (onTestSaved) {
        onTestSaved(generatedResult.testFilePath);
      }
    } catch (err) {
      alert('Failed to save unit test to workspace: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCases = latestRun?.testCases?.filter((c) => {
    if (filterStatus === 'passed') return c.status === 'passed';
    if (filterStatus === 'failed') return c.status === 'failed';
    return true;
  }) || [];

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Top Banner & Execution Bar */}
      <div className="bg-gradient-to-r from-surface to-surface-subtle p-6 rounded-2xl border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-xl shadow-lg shadow-emerald-500/10">
            {latestRun ? `${latestRun.healthScore}%` : '100%'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Test Health &amp; Verification Suite</h2>
              <Badge variant="success" className="uppercase font-mono text-[10px]">
                Phase 5 Engine Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated regression testing, Vitest execution, and AI unit test code generation.
            </p>
          </div>
        </div>

        <Button
          id="run-full-tests-btn"
          onClick={handleRunTests}
          variant="primary"
          isLoading={isRunning}
          className="shadow-lg shadow-brand-600/30"
          leftIcon={<Play className="w-4 h-4 fill-current" />}
        >
          {isRunning ? 'Running Test Suites...' : 'Run Full Test Suite'}
        </Button>
      </div>

      {/* Metrics Row */}
      {latestRun && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Total Test Cases</span>
            <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{latestRun.totalTests}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Passing Suites</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{latestRun.passedTests}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Failing Suites</span>
            <p className="text-2xl font-bold text-rose-400 font-mono mt-1">{latestRun.failedTests}</p>
          </Card>
          <Card className="p-4 bg-surface/80 border-surface-border">
            <span className="text-[11px] font-medium text-slate-400">Execution Time</span>
            <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">{latestRun.durationMs} ms</p>
          </Card>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'cases'
              ? 'bg-brand-600/20 text-brand-accent border border-brand-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-surface-subtle'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Test Suite Execution ({filteredCases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('generate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'generate'
              ? 'bg-brand-600/20 text-brand-accent border border-brand-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-surface-subtle'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <span>AI Unit Test Generator</span>
        </button>
      </div>

      {/* Test Cases View */}
      {activeTab === 'cases' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="text-sm font-bold text-slate-200">Executed Test Cases</h3>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-lg border border-surface-border text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterStatus === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('passed')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterStatus === 'passed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setFilterStatus('failed')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterStatus === 'failed' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Failed
              </button>
            </div>
          </div>

          {isLoadingHistory ? (
            <p className="text-xs text-slate-400 text-center py-8">Loading test runner results...</p>
          ) : filteredCases.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No matching test cases found.</p>
          ) : (
            <div className="space-y-2.5">
              {filteredCases.map((tc) => (
                <div
                  key={tc.id}
                  className="bg-surface-subtle/50 border border-surface-border/60 rounded-xl p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {tc.status === 'passed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{tc.name}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">{tc.suiteName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {tc.durationMs} ms
                    </span>
                    <Badge variant={tc.status === 'passed' ? 'success' : 'danger'} className="uppercase font-mono text-[10px]">
                      {tc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* AI Unit Test Generator View */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              Generate Unit Test Suite
            </h3>
            <p className="text-xs text-slate-400">
              Select a target workspace file to automatically generate a Vitest unit test suite.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Target Workspace File</label>
              <div className="relative">
                <FileCode className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  id="target-test-file-input"
                  value={targetFile}
                  onChange={(e) => setTargetFile(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-subtle border border-surface-border rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
                  placeholder="e.g. src/controllers/authController.js"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Test Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500"
              >
                <option value="unit">Unit Tests (Functions &amp; Guards)</option>
                <option value="integration">Integration Tests (API Routes)</option>
                <option value="edge_cases">Edge Cases &amp; Security Boundary Tests</option>
              </select>
            </div>

            <Button
              id="generate-test-btn"
              onClick={handleGenerateTest}
              variant="primary"
              className="w-full shadow-lg shadow-brand-600/30"
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {isGenerating ? 'Generating Unit Tests...' : 'Generate AI Test Suite'}
            </Button>
          </Card>

          {/* Generated Code Preview */}
          <Card className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
                <FileCode className="w-4 h-4 text-brand-accent" />
                <span>{generatedResult?.testFilePath || 'tests/authController.unit.test.ts'}</span>
              </div>

              {generatedResult && (
                <Button
                  id="save-test-btn"
                  onClick={handleSaveTest}
                  variant={isSaved ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={isSaved}
                  isLoading={isSaving}
                  leftIcon={isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                >
                  {isSaved ? 'Saved to Workspace' : 'Save Test to Workspace'}
                </Button>
              )}
            </div>

            <div className="bg-[#0B0D10] p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96 border border-surface-border">
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {generatedResult?.generatedTestCode ||
                  `// AI Unit Test Suite Generator Preview
// Click "Generate AI Test Suite" on the left to analyze target file AST.`}
              </pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
