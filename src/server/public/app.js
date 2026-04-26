const repoUrl = document.getElementById('repoUrl');
const packBtn = document.getElementById('packBtn');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const totalFiles = document.getElementById('totalFiles');
const totalTokens = document.getElementById('totalTokens');
const preview = document.getElementById('preview');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

let packedMarkdown = '';

packBtn.addEventListener('click', async () => {
  const url = repoUrl.value.trim();
  if (!url) {
    showError('Please enter a GitHub URL');
    return;
  }

  hideError();
  hideResult();
  showLoading();

  try {
    const response = await fetch('/api/pack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unknown error');

    packedMarkdown = data.packed;
    displayResult(data);
  } catch (err) {
    showError(err.message);
  } finally {
    hideLoading();
  }
});

function displayResult(data) {
  totalFiles.textContent = data.stats.perFile.length;
  totalTokens.textContent = data.stats.totalTokens.toLocaleString();
  preview.textContent = data.packed.substring(0, 2000);
  if (data.packed.length > 2000) preview.textContent += '\n... (truncated)';
  resultDiv.classList.remove('hidden');
}

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}

function hideError() {
  errorDiv.classList.add('hidden');
}

function showLoading() {
  loadingDiv.classList.remove('hidden');
}

function hideLoading() {
  loadingDiv.classList.add('hidden');
}

function hideResult() {
  resultDiv.classList.add('hidden');
}

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(packedMarkdown).then(() => {
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => (copyBtn.textContent = '📋 Copy'), 2000);
  }).catch(() => alert('Failed to copy'));
});

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([packedMarkdown], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'repo2rag-output.md';
  a.click();
  URL.revokeObjectURL(a.href);
});