# 📦 repo2rag

**Turn any GitHub repository into a single, AI‑friendly Markdown file — packed with token stats.**

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

---

## 🔥 Why repo2rag?

Feeding a whole codebase to an LLM (Claude, ChatGPT, DeepSeek, etc.) is painful.  
**repo2rag** clones a GitHub repo, scans all text files, counts tokens (using OpenAI's `cl100k_base` encoding), and packs them into one neat Markdown file — ideal for AI prompts.

Perfect for:

- **Code reviews** via LLMs
- **Onboarding** – ask questions about a new codebase
- **Documentation** generation
- **Interview demos** 😉

---

## ✨ Features

- 🔗 **GitHub URL input** – simply paste a repo link (web UI or CLI)
- 🧠 **AI‑optimized output** – Markdown with syntax‑highlighted code blocks
- 📊 **Token counting** – per‑file & total tokens (respects LLM context limits)
- ⚡ **One‑command packing** – `npm run cli -- <url>`
- 🎨 **Beautiful web demo** – a single‑page app for interviewers
- 🧪 **Unit‑tested** – Vitest with 6 passing tests
- 🔒 **Security‑aware** – respects `.gitignore` and `.repomixignore`, excludes binaries

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Install & Run

```bash
git clone https://github.com/rsalehin/repo2rag.git
cd repo2rag
npm install

Start the Web Demo

npm start
Open http://localhost:3000 in your browser. Paste a GitHub URL and hit Pack Repository.
CLI Usage
npm run cli -- https://github.com/octocat/Hello-World
Writes repo2rag-output.md to your current directory.
🧪 Running Tests
npm test

Architecture

repo2rag/
├── src/
│   ├── core/              # Pure logic (zero I/O side effects)
│   │   ├── clone.ts       # Clone GitHub repo to temp directory
│   │   ├── collect.ts     # Recursive text file scanner (gitignore-aware)
│   │   ├── tokens.ts      # Token counting with @dqbd/tiktoken
│   │   └── pack.ts        # Markdown assembler
│   ├── cli/
│   │   └── index.ts       # Command‑line entry point
│   └── server/
│       ├── index.ts       # Express server (POST /api/pack)
│       └── public/        # Static web UI (vanilla HTML/CSS/JS)
├── tests/                 # Vitest unit tests
├── package.json
└── tsconfig.json

Data Flow

GitHub URL → Clone → Collect files → Count tokens → Pack → Markdown output

Tech Stack
LayerTechnology
LanguageTypeScript
RuntimeNode.js
ServerExpress
FrontendVanilla HTML/CSS/JS (no frameworks)
Token Counting@dqbd/tiktoken (cl100k_base)
File Discoveryfast-glob + ignore
Gitsimple-git (shallow clone)
TestingVitest