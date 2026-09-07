"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCode = exports.saveFileContent = exports.getFileContent = exports.getFileTree = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const scanner_service_1 = require("../services/scanner.service");
const search_service_1 = require("../services/search.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
// Sample in-memory files for Demo Mode / sample workspaces
const sampleFileTrees = {
    default: [
        {
            name: 'src',
            path: 'src',
            type: 'directory',
            children: [
                {
                    name: 'controllers',
                    path: 'src/controllers',
                    type: 'directory',
                    children: [
                        { name: 'authController.js', path: 'src/controllers/authController.js', type: 'file', extension: 'js' },
                        { name: 'userController.js', path: 'src/controllers/userController.js', type: 'file', extension: 'js' },
                    ],
                },
                {
                    name: 'middleware',
                    path: 'src/middleware',
                    type: 'directory',
                    children: [
                        { name: 'authMiddleware.js', path: 'src/middleware/authMiddleware.js', type: 'file', extension: 'js' },
                    ],
                },
                {
                    name: 'routes',
                    path: 'src/routes',
                    type: 'directory',
                    children: [
                        { name: 'authRoutes.js', path: 'src/routes/authRoutes.js', type: 'file', extension: 'js' },
                    ],
                },
                { name: 'app.js', path: 'src/app.js', type: 'file', extension: 'js' },
            ],
        },
        { name: 'package.json', path: 'package.json', type: 'file', extension: 'json' },
        { name: 'README.md', path: 'README.md', type: 'file', extension: 'md' },
    ],
};
const sampleFileContents = {
    'src/controllers/authController.js': `// Auth Controller - MERN Authentication Service
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  // JWT Sign payload
  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret');
  return res.json({ success: true, token });
};
`,
    'src/middleware/authMiddleware.js': `// JWT Authentication Middleware
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
`,
    'package.json': `{
  "name": "mern-auth-service",
  "version": "1.0.0",
  "main": "src/app.js",
  "dependencies": {
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  }
}
`,
};
const getFileTree = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id } = req.params;
        // Check project workspace directory
        const workspaceDir = path_1.default.resolve(process.cwd(), `../../workspaces/${id}`);
        if (fs_1.default.existsSync(workspaceDir)) {
            const tree = scanner_service_1.scannerService.scanDirectory(workspaceDir);
            (0, response_formatter_1.sendSuccess)(res, tree);
            return;
        }
        // Demo Mode fallback
        (0, response_formatter_1.sendSuccess)(res, sampleFileTrees.default);
    }
    catch (error) {
        next(error);
    }
};
exports.getFileTree = getFileTree;
const getFileContent = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id } = req.params;
        const filePath = req.query.path;
        if (!filePath) {
            throw api_error_1.ApiError.badRequest('File path query parameter is required');
        }
        const workspaceDir = path_1.default.resolve(process.cwd(), `../../workspaces/${id}`);
        if (fs_1.default.existsSync(workspaceDir)) {
            const fileData = scanner_service_1.scannerService.readFileContent(workspaceDir, filePath);
            (0, response_formatter_1.sendSuccess)(res, fileData);
            return;
        }
        // Demo Mode fallback
        const content = sampleFileContents[filePath] || `// File: ${filePath}\n// DevForge AI Workspace Code Analysis\n`;
        const language = scanner_service_1.scannerService.detectLanguage(filePath);
        (0, response_formatter_1.sendSuccess)(res, { content, language });
    }
    catch (error) {
        next(error);
    }
};
exports.getFileContent = getFileContent;
const saveFileContent = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id } = req.params;
        const { path: filePath, content } = req.body;
        if (!filePath || content === undefined) {
            throw api_error_1.ApiError.badRequest('File path and content are required');
        }
        const workspaceDir = path_1.default.resolve(process.cwd(), `../../workspaces/${id}`);
        if (fs_1.default.existsSync(workspaceDir)) {
            scanner_service_1.scannerService.saveFileContent(workspaceDir, filePath, content);
        }
        else {
            sampleFileContents[filePath] = content;
        }
        (0, response_formatter_1.sendSuccess)(res, { message: 'File saved successfully', path: filePath });
    }
    catch (error) {
        next(error);
    }
};
exports.saveFileContent = saveFileContent;
const searchCode = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id } = req.params;
        const query = req.query.q;
        if (!query) {
            (0, response_formatter_1.sendSuccess)(res, []);
            return;
        }
        const workspaceDir = path_1.default.resolve(process.cwd(), `../../workspaces/${id}`);
        if (fs_1.default.existsSync(workspaceDir)) {
            const matches = search_service_1.searchService.searchInDirectory(workspaceDir, query);
            (0, response_formatter_1.sendSuccess)(res, matches);
            return;
        }
        // Demo Mode fallback search
        const matches = [];
        Object.entries(sampleFileContents).forEach(([filePath, content]) => {
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
                if (line.toLowerCase().includes(query.toLowerCase())) {
                    matches.push({
                        filePath,
                        lineNumber: idx + 1,
                        lineContent: line.trim(),
                        matchSnippet: line.trim(),
                    });
                }
            });
        });
        (0, response_formatter_1.sendSuccess)(res, matches);
    }
    catch (error) {
        next(error);
    }
};
exports.searchCode = searchCode;
