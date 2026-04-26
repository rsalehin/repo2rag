import type { FileEntry, FileTokenInfo, TokenStats } from './index';

const EXT_LANG_MAP: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.json': 'json',
  '.md': 'markdown',
  '.mdx': 'mdx',
  '.css': 'css',
  '.html': 'html',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.py': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.sh': 'bash',
  '.bash': 'bash',
  '.ps1': 'powershell',
  '.txt': 'text',
  '': 'text',
};

function getLang(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.')) || '';
  return EXT_LANG_MAP[ext] || '';
}

export interface PackedResult {
  packed: string;
  stats: TokenStats;
}

/**
 * Produce final Markdown string from file entries and token statistics.
 */
export function pack(files: FileEntry[], stats: TokenStats): PackedResult {
  const lines: string[] = [];

  // Header
  lines.push(`# Repository Content`);
  lines.push(`**Total files:** ${stats.perFile.length}`);
  lines.push(`**Total tokens:** ${stats.totalTokens}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // File by file
  for (const file of files) {
    const fileStat = stats.perFile.find(s => s.path === file.path);
    const tokens = fileStat ? ` (${fileStat.tokens} tokens)` : '';
    lines.push(`## File: ${file.path}${tokens}`);
    lines.push('');
    const lang = getLang(file.path);
    lines.push('```' + lang);
    lines.push(file.content);
    lines.push('```');
    lines.push('');
  }

  return { packed: lines.join('\n'), stats };
}
