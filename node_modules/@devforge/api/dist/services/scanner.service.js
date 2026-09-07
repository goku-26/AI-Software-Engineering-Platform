"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scannerService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const api_error_1 = require("../utils/api-error");
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
const LANGUAGE_MAP = {
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
exports.scannerService = {
    detectLanguage: (filePath) => {
        const ext = path_1.default.extname(filePath).slice(1).toLowerCase();
        return LANGUAGE_MAP[ext] || 'plaintext';
    },
    scanDirectory: (dirPath, rootDir = dirPath) => {
        if (!fs_1.default.existsSync(dirPath)) {
            return [];
        }
        const entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
        const nodes = [];
        for (const entry of entries) {
            if (EXCLUDED_DIRS.has(entry.name))
                continue;
            const fullPath = path_1.default.join(dirPath, entry.name);
            const relativePath = path_1.default.relative(rootDir, fullPath).replace(/\\/g, '/');
            if (entry.isDirectory()) {
                const children = exports.scannerService.scanDirectory(fullPath, rootDir);
                nodes.push({
                    name: entry.name,
                    path: relativePath,
                    type: 'directory',
                    children,
                });
            }
            else if (entry.isFile()) {
                const stats = fs_1.default.statSync(fullPath);
                nodes.push({
                    name: entry.name,
                    path: relativePath,
                    type: 'file',
                    extension: path_1.default.extname(entry.name).slice(1).toLowerCase(),
                    size: stats.size,
                });
            }
        }
        return nodes.sort((a, b) => {
            if (a.type === b.type)
                return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
        });
    },
    readFileContent: (baseDir, relativePath) => {
        const safePath = path_1.default.normalize(path_1.default.join(baseDir, relativePath));
        // Security check: prevent path traversal attacks
        if (!safePath.startsWith(path_1.default.normalize(baseDir))) {
            throw api_error_1.ApiError.forbidden('Access denied: Invalid file path');
        }
        if (!fs_1.default.existsSync(safePath) || !fs_1.default.statSync(safePath).isFile()) {
            throw api_error_1.ApiError.notFound(`File not found: ${relativePath}`);
        }
        const content = fs_1.default.readFileSync(safePath, 'utf-8');
        const language = exports.scannerService.detectLanguage(relativePath);
        return { content, language };
    },
    saveFileContent: (baseDir, relativePath, content) => {
        const safePath = path_1.default.normalize(path_1.default.join(baseDir, relativePath));
        if (!safePath.startsWith(path_1.default.normalize(baseDir))) {
            throw api_error_1.ApiError.forbidden('Access denied: Invalid file path');
        }
        const parentDir = path_1.default.dirname(safePath);
        if (!fs_1.default.existsSync(parentDir)) {
            fs_1.default.mkdirSync(parentDir, { recursive: true });
        }
        fs_1.default.writeFileSync(safePath, content, 'utf-8');
    },
};
