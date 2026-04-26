import fs from 'fs';
import os from 'os';
import path from 'path';
import simpleGit from 'simple-git';

export async function cloneRepo(url: string): Promise<string> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo2rag-'));
  const git = simpleGit();
  await git.clone(url, tmpDir, ['--depth', '1']);
  return tmpDir;
}
