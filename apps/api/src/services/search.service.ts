import fs from 'fs';
import path from 'path';

export interface CodeSearchMatch {
  filePath: string;
  lineNumber: number;
  lineContent: string;
  matchSnippet: string;
}

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.cache',
  'coverage',
]);

export const searchService = {
  searchInDirectory: (dirPath: string, query: string, rootDir: string = dirPath): CodeSearchMatch[] => {
    if (!query || query.trim() === '' || !fs.existsSync(dirPath)) {
      return [];
    }

    const matches: CodeSearchMatch[] = [];
    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    const searchRecursive = (currentDir: string) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (EXCLUDED_DIRS.has(entry.name)) continue;

        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

        if (entry.isDirectory()) {
          searchRecursive(fullPath);
        } else if (entry.isFile()) {
          // Exclude binary or huge files
          const ext = path.extname(entry.name).toLowerCase();
          if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.exe', '.lock'].includes(ext)) {
            continue;
          }

          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
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
          } catch {
            // Ignore unreadable binary files
          }
        }

        if (matches.length >= 100) break; // Cap results at 100
      }
    };

    searchRecursive(dirPath);
    return matches;
  },
};
