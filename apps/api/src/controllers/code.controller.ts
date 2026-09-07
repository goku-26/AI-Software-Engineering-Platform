import { Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { scannerService } from '../services/scanner.service';
import { searchService } from '../services/search.service';
import { Project } from '../models/project.model';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Sample in-memory files for Demo Mode / sample workspaces
const sampleFileTrees: Record<string, any[]> = {
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

const sampleFileContents: Record<string, string> = {
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

export const getFileTree = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { id } = req.params;

    // Check project workspace directory
    const workspaceDir = path.resolve(process.cwd(), `../../workspaces/${id}`);
    if (fs.existsSync(workspaceDir)) {
      const tree = scannerService.scanDirectory(workspaceDir);
      sendSuccess(res, tree);
      return;
    }

    // Demo Mode fallback
    sendSuccess(res, sampleFileTrees.default);
  } catch (error) {
    next(error);
  }
};

export const getFileContent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { id } = req.params;
    const filePath = req.query.path as string;

    if (!filePath) {
      throw ApiError.badRequest('File path query parameter is required');
    }

    const workspaceDir = path.resolve(process.cwd(), `../../workspaces/${id}`);
    if (fs.existsSync(workspaceDir)) {
      const fileData = scannerService.readFileContent(workspaceDir, filePath);
      sendSuccess(res, fileData);
      return;
    }

    // Demo Mode fallback
    const content = sampleFileContents[filePath] || `// File: ${filePath}\n// DevForge AI Workspace Code Analysis\n`;
    const language = scannerService.detectLanguage(filePath);
    sendSuccess(res, { content, language });
  } catch (error) {
    next(error);
  }
};

export const saveFileContent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { id } = req.params;
    const { path: filePath, content } = req.body;

    if (!filePath || content === undefined) {
      throw ApiError.badRequest('File path and content are required');
    }

    const workspaceDir = path.resolve(process.cwd(), `../../workspaces/${id}`);
    if (fs.existsSync(workspaceDir)) {
      scannerService.saveFileContent(workspaceDir, filePath, content);
    } else {
      sampleFileContents[filePath] = content;
    }

    sendSuccess(res, { message: 'File saved successfully', path: filePath });
  } catch (error) {
    next(error);
  }
};

export const searchCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { id } = req.params;
    const query = req.query.q as string;

    if (!query) {
      sendSuccess(res, []);
      return;
    }

    const workspaceDir = path.resolve(process.cwd(), `../../workspaces/${id}`);
    if (fs.existsSync(workspaceDir)) {
      const matches = searchService.searchInDirectory(workspaceDir, query);
      sendSuccess(res, matches);
      return;
    }

    // Demo Mode fallback search
    const matches: any[] = [];
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

    sendSuccess(res, matches);
  } catch (error) {
    next(error);
  }
};
