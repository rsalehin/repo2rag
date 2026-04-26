import path from 'path';
import fg from 'fast-glob';
import ignore from 'ignore';
import fs from 'fs/promises';

const DOT_GITIGNORE = '.gitignore';
const DOT_REPOMIXIGNORE = '.repomixignore';

// Common binary file extensions to exclude
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.zip', '.tar', '.gz', '.7z', '.rar',
  '.exe', '.dll', '.so', '.dylib', '.bin',
  '.mp3', '.mp4', '.avi', '.mov', '.mkv',
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
  '.db', '.sqlite', '.sqlite3',
  '.o', '.class', '.pyc',
  '.wasm',
]);

export interface FileEntry {
  path: string;
  content: string;
}

/**
 * Recursively collect text files from a directory, respecting ignore files.
 */
export async function collectFiles(repoPath: string): Promise<FileEntry[]> {
  const ignorePatterns: string[] = [];

  // Read .gitignore if exists
  try {
    const gitignoreContent = await fs.readFile(path.join(repoPath, DOT_GITIGNORE), 'utf8');
    ignorePatterns.push(gitignoreContent);
  } catch {}

  // Read .repomixignore if exists
  try {
    const repomixignoreContent = await fs.readFile(path.join(repoPath, DOT_REPOMIXIGNORE), 'utf8');
    ignorePatterns.push(repomixignoreContent);
  } catch {}

  // Create ignore filter
  const ig = ignore().add(ignorePatterns.join('\n'));

  // Get all files (excluding directories)
  const allFiles = await fg('**/*', {
    cwd: repoPath,
    dot: true,           // include dotfiles
    onlyFiles: true,
    followSymbolicLinks: false,
    ignore: ['node_modules/**', '.git/**'],   // always exclude these
  });

  const entries: FileEntry[] = [];

  for (const relativePath of allFiles) {
    // Apply ignore filter
    if (ig.ignores(relativePath)) continue;

    // Check extension
    const ext = path.extname(relativePath).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;

    try {
      const filePath = path.join(repoPath, relativePath);
      const content = await fs.readFile(filePath, 'utf8');
      entries.push({ path: relativePath, content });
    } catch {
      // Skip files that can't be read as text (binary or encoding issues)
    }
  }

  // Sort for deterministic output
  entries.sort((a, b) => a.path.localeCompare(b.path));
  return entries;
}
