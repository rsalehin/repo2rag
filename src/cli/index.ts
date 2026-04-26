import { cloneRepo, collectFiles, countTokens, pack } from '../core';
import fs from 'fs';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: npm run cli -- <github-url>');
    process.exit(1);
  }

  console.log(Cloning ...);
  const repoPath = await cloneRepo(url);

  console.log('Collecting files...');
  const files = await collectFiles(repoPath);

  console.log('Counting tokens...');
  const stats = countTokens(files);

  console.log('Packing...');
  const result = pack(files, stats);

  const outputPath = 'repo2rag-output.md';
  fs.writeFileSync(outputPath, result.packed, 'utf8');

  console.log(\nDone! Packed  files ( tokens) into );
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
