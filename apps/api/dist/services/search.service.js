"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EXCLUDED_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.cache',
    'coverage',
]);
exports.searchService = {
    searchInDirectory: (dirPath, query, rootDir = dirPath) => {
        if (!query || query.trim() === '' || !fs_1.default.existsSync(dirPath)) {
            return [];
        }
        const matches = [];
        const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const searchRecursive = (currentDir) => {
            const entries = fs_1.default.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                if (EXCLUDED_DIRS.has(entry.name))
                    continue;
                const fullPath = path_1.default.join(currentDir, entry.name);
                const relativePath = path_1.default.relative(rootDir, fullPath).replace(/\\/g, '/');
                if (entry.isDirectory()) {
                    searchRecursive(fullPath);
                }
                else if (entry.isFile()) {
                    // Exclude binary or huge files
                    const ext = path_1.default.extname(entry.name).toLowerCase();
                    if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.exe', '.lock'].includes(ext)) {
                        continue;
                    }
                    try {
                        const content = fs_1.default.readFileSync(fullPath, 'utf-8');
                        const lines = content.split('\n');
                        lines.forEach((line, index) => {
                            if (searchRegex.test(line)) {
                                matches.push({
                                    filePath: relativePath,
                                    lineNumber: index + 1,
                                    lineContent: line.trim(),
                                    matchSnippet: line.trim(),
                                });
                            }
                            searchRegex.lastIndex = 0;
                        });
                    }
                    catch {
                        // Ignore unreadable binary files
                    }
                }
                if (matches.length >= 100)
                    break; // Cap results at 100
            }
        };
        searchRecursive(dirPath);
        return matches;
    },
};
