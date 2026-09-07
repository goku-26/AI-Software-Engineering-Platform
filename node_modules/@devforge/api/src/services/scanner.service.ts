import fs from 'fs';
import path from 'path';
import { ApiError } from '../utils/api-error';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  children?: FileNode[];
}

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.cache',
  'coverage',
  '.vscode',
  '.idea',
]);

const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  html: 'html',
  css: 'css',
  py: 'python',
  java: 'java',
  sql: 'sql',
  md: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  sh: 'shell',
};

export const scannerService = {
  detectLanguage: (filePath: string): string => {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    return LANGUAGE_MAP[ext] || 'plaintext';
  },

  scanDirectory: (dirPath: string, rootDir: string = dirPath): FileNode[] => {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        const children = scannerService.scanDirectory(fullPath, rootDir);
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: 'directory',
          children,
        });
      } else if (entry.isFile()) {
        const stats = fs.statSync(fullPath);
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: 'file',
          extension: path.extname(entry.name).slice(1).toLowerCase(),
          size: stats.size,
        });
      }
    }

    return nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  },

  readFileContent: (baseDir: string, relativePath: string): { content: string; language: string } => {
    const safePath = path.normalize(path.join(baseDir, relativePath));

    // Security check: prevent path traversal attacks
    if (!safePath.startsWith(path.normalize(baseDir))) {
      throw ApiError.forbidden('Access denied: Invalid file path');
    }

    if (!fs.existsSync(safePath) || !fs.statSync(safePath).isFile()) {
      throw ApiError.notFound(`File not found: ${relativePath}`);
    }

    const content = fs.readFileSync(safePath, 'utf-8');
    const language = scannerService.detectLanguage(relativePath);

    return { content, language };
  },

  saveFileContent: (baseDir: string, relativePath: string, content: string): void => {
    const safePath = path.normalize(path.join(baseDir, relativePath));

    if (!safePath.startsWith(path.normalize(baseDir))) {
      throw ApiError.forbidden('Access denied: Invalid file path');
    }

    const parentDir = path.dirname(safePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.writeFileSync(safePath, content, 'utf-8');
  },
};
