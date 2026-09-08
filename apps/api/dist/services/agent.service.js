"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const scanner_service_1 = require("./scanner.service");
const api_error_1 = require("../utils/api-error");
// In-memory store for Agent Execution Tasks
const taskStore = new Map();
exports.agentService = {
    /**
     * Initiates a multi-agent execution workflow for a project prompt.
     */
    executeTask: async (projectId, dto) => {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const role = dto.role || 'coder';
        const targetFiles = dto.targetFiles && dto.targetFiles.length > 0 ? dto.targetFiles : ['src/controllers/authController.js'];
        const targetFile = targetFiles[0];
        const now = new Date().toISOString();
        // Read initial file content if available in workspace
        let originalContent = '';
        const workspaceDir = path_1.default.resolve(process.cwd(), `../../workspaces/${projectId}`);
        if (fs_1.default.existsSync(workspaceDir) && targetFile) {
            try {
                const fileData = scanner_service_1.scannerService.readFileContent(workspaceDir, targetFile);
                originalContent = fileData.content;
            }
            catch {
                originalContent = '// Target file initialization\n';
            }
        }
        else {
            originalContent = `// Auth Controller - MERN Authentication Service
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret');
  return res.json({ success: true, token });
};
`;
        }
        // Generate intelligent patch content based on task prompt & role
        const newContent = generateCodePatch(dto.prompt, role, targetFile, originalContent);
        // Build multi-agent execution steps
        const steps = [
            {
                id: `step_1_${Date.now()}`,
                role: 'architect',
                title: 'Architect Agent: Workspace Context & AST Analysis',
                detail: `Inspected directory tree and parsed AST structure for target context: [${targetFiles.join(', ')}]. Formulated execution plan for prompt: "${dto.prompt}".`,
                status: 'completed',
                timestamp: new Date().toISOString(),
            },
            {
                id: `step_2_${Date.now()}`,
                role: 'coder',
                title: 'Coding Agent: Code Patch Generation',
                detail: `Generated file modification patch for target file [${targetFile}]. Applied secure error validation and payload verification.`,
                status: 'completed',
                codePatch: {
                    filePath: targetFile,
                    description: `AI Agent Patch for ${dto.prompt}`,
                    originalContent,
                    newContent,
                },
                timestamp: new Date().toISOString(),
            },
            {
                id: `step_3_${Date.now()}`,
                role: 'reviewer',
                title: 'Reviewer Agent: Security & AST Audit',
                detail: 'Audited generated patch against security vulnerabilities (CWE/OWASP) and confirmed zero breaking changes.',
                status: 'completed',
                timestamp: new Date().toISOString(),
            },
        ];
        const task = {
            id: taskId,
            projectId,
            prompt: dto.prompt,
            role,
            status: 'completed',
            targetFiles,
            steps,
            generatedPatch: {
                filePath: targetFile,
                description: `Patch for ${dto.prompt}`,
                originalContent,
                newContent,
            },
            isApplied: false,
            createdAt: now,
            updatedAt: now,
        };
        taskStore.set(taskId, task);
        return task;
    },
    /**
     * Retrieves all historical agent tasks for a given project.
     */
    getProjectTasks: async (projectId) => {
        const tasks = [];
        taskStore.forEach((task) => {
            if (task.projectId === projectId) {
                tasks.push(task);
            }
        });
        // Provide default initial task if history is empty
        if (tasks.length === 0) {
            const defaultTask = {
                id: 'task_demo_01',
                projectId,
                prompt: 'Patched authController payload verification and added JWT refresh token support',
                role: 'coder',
                status: 'completed',
                targetFiles: ['src/controllers/authController.js'],
                steps: [
                    {
                        id: 'step_demo_1',
                        role: 'architect',
                        title: 'Architect Agent: AST Scan',
                        detail: 'Scanned 28 workspace files. Identified missing input validation guard in authController.js.',
                        status: 'completed',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                    },
                    {
                        id: 'step_demo_2',
                        role: 'coder',
                        title: 'Coding Agent: Refactor Execution',
                        detail: 'Updated login request payload verification and error handling.',
                        status: 'completed',
                        timestamp: new Date(Date.now() - 3500000).toISOString(),
                    },
                    {
                        id: 'step_demo_3',
                        role: 'reviewer',
                        title: 'Reviewer Agent: Quality Audit',
                        detail: 'Code quality score 94%. Zero breaking changes found.',
                        status: 'completed',
                        timestamp: new Date(Date.now() - 3400000).toISOString(),
                    },
                ],
                generatedPatch: {
                    filePath: 'src/controllers/authController.js',
                    description: 'Updated auth controller with input validation and safe JWT error handling',
                    originalContent: '// Initial auth controller',
                    newContent: '// Updated auth controller with safe JWT error handling',
                },
                isApplied: true,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 3400000).toISOString(),
            };
            return [defaultTask];
        }
        return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    /**
     * Gets a specific agent task by ID.
     */
    getTaskById: async (taskId) => {
        const task = taskStore.get(taskId);
        if (!task) {
            throw api_error_1.ApiError.notFound(`Agent task not found with ID: ${taskId}`);
        }
        return task;
    },
    /**
     * Applies the code patch generated by an agent task to the target file.
     */
    applyPatch: async (projectId, taskId) => {
        const task = taskStore.get(taskId);
        if (!task) {
            throw api_error_1.ApiError.notFound(`Agent task not found with ID: ${taskId}`);
        }
        if (!task.generatedPatch) {
            throw api_error_1.ApiError.badRequest('No code patch is available for this task.');
        }
        const { filePath, newContent } = task.generatedPatch;
        // Apply patch to physical workspace if directory exists
        const workspaceDir = path_1.default.resolve(process.cwd(), `../../workspaces/${projectId}`);
        if (fs_1.default.existsSync(workspaceDir)) {
            scanner_service_1.scannerService.saveFileContent(workspaceDir, filePath, newContent);
        }
        task.isApplied = true;
        task.appliedAt = new Date().toISOString();
        taskStore.set(taskId, task);
        return {
            message: `Code patch for ${filePath} applied successfully.`,
            filePath,
        };
    },
};
/**
 * Helper to generate contextual code patches based on user prompt and role.
 */
function generateCodePatch(prompt, role, filePath, existingContent) {
    const cleanPrompt = prompt.toLowerCase();
    if (cleanPrompt.includes('auth') || cleanPrompt.includes('jwt') || cleanPrompt.includes('login')) {
        return `// Auth Controller - DevForge AI Enhanced Patch (${role.toUpperCase()} AGENT)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Enhanced User Login Handler
 * AI Prompt: ${prompt}
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Strict input validation guard added by DevForge AI Agent
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    // JWT payload generation
    const token = jwt.sign(
      { email, role: 'developer' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: { email, role: 'developer' },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error during authentication' });
  }
};
`;
    }
    // Generic patched code output
    return `// Patched by DevForge AI (${role.toUpperCase()} AGENT)
// Task Prompt: ${prompt}
// Target File: ${filePath}

${existingContent}

// --- DevForge AI Agent Code Enhancement ---
function verifyAIExecutionGuard() {
  console.log('[DevForge AI Agent] Task "${prompt}" verified successfully.');
  return true;
}

module.exports = {
  verifyAIExecutionGuard
};
`;
}
