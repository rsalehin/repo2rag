import express, { Request, Response } from 'express';
import path from 'path';
import { cloneRepo, collectFiles, countTokens, pack } from '../core';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/pack', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing "url" in request body' });
    return;
  }

  let repoPath: string | undefined;
  try {
    console.log(`Cloning ${url}...`);
    repoPath = await cloneRepo(url);

    console.log('Collecting files...');
    const files = await collectFiles(repoPath);

    console.log('Counting tokens...');
    const stats = countTokens(files);

    console.log('Packing...');
    const { packed } = pack(files, stats);

    res.json({ packed, stats });
  } catch (err: any) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  } finally {
    // Cleanup temporary repo
    if (repoPath) {
      await fs.rm(repoPath, { recursive: true, force: true }).catch(() => {});
    }
  }
});

app.listen(PORT, () => {
  console.log(`repo2rag server running at http://localhost:${PORT}`);
});