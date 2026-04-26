import { encoding_for_model } from '@dqbd/tiktoken';

export interface FileTokenInfo {
  path: string;
  tokens: number;
}

export interface TokenStats {
  totalTokens: number;
  perFile: FileTokenInfo[];
}

/**
 * Count tokens in each file's content and return totals.
 * Uses the cl100k_base encoding (GPT-4/3.5).
 */
export function countTokens(files: { path: string; content: string }[]): TokenStats {
  const enc = encoding_for_model('gpt-4'); // cl100k_base
  const perFile: FileTokenInfo[] = [];

  for (const file of files) {
    const tokens = enc.encode(file.content).length;
    perFile.push({ path: file.path, tokens });
  }

  const totalTokens = perFile.reduce((sum, f) => sum + f.tokens, 0);
  enc.free(); // release memory

  return { totalTokens, perFile };
}
