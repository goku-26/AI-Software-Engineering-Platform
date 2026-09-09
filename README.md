# DevForge AI — Autonomous AI Software Engineering Platform

> **Build Software With AI: Plan. Code. Test. Debug. Review. Ship.**

DevForge AI is a production-grade, multi-agent AI software engineering platform designed to connect with codebases, plan engineering tasks, execute code changes safely in isolated environments, run automated test suites, self-heal runtime failures, perform security scans, and manage continuous delivery workflows.

---

## 🚀 Key Features & Architecture

- **⚡ Autonomous Multi-Agent Loop**: Coordinated orchestration between Architect, Coding, Test, Debugger, Security, and Review agents.
- **🔍 Codebase Intelligence**: AST parsing, language detection, dependency mapping, and semantic code search across large repositories.
- **🔄 Generate → Test → Fix Loop**: Automated test runner execution with self-healing debug iteration up to strict verification limits.
- **🛡️ Security Scan Engine**: In-depth static analysis, vulnerability detection, JWT state checks, and sandbox constraints.
- **📦 Multi-Repo & Monorepo Intelligence**: Cross-package dependency resolution, version syncing, and workspace graph visualization.
- **🌿 Isolated Git Workflows**: Feature branch isolation, diff previewing, commit generation, and pull request readiness.
- **📊 AI Observability & Metrics**: Token cost tracking, latency monitoring, prompt execution history, and evaluation benchmarks.
- **☁️ Enterprise Cloud Infrastructure**: Docker, Kubernetes deployment previewing, environment variables management, and production release orchestration.

---

## 📁 Repository Structure

```text
.
├── apps/
│   ├── api/                 # Node.js + Express + TypeScript API server
│   │   ├── src/
│   │   │   ├── config/      # Database & environment configurations
│   │   │   ├── controllers/ # Auth, Project, Code, Agent, Security, Git, etc.
│   │   │   ├── middleware/  # JWT auth, error handling, rate limiting
│   │   │   ├── models/      # Mongoose schemas (User, Project, Task, Audit, etc.)
│   │   │   ├── routes/      # Express API routes
│   │   │   ├── services/    # Core business logic & agent orchestration
│   │   │   └── utils/       # Logger, token helpers, AST helpers
│   │   └── tests/           # Integration & unit test suites (Vitest + Supertest)
│   └── web/                 # React + Vite + Tailwind UI application
│       ├── src/
│       │   ├── components/  # Modular UI panels (Agent, Security, Git, Infrastructure, etc.)
│       │   ├── context/     # Auth and Workspace React contexts
│       │   ├── pages/       # Dashboard, Project Details, Auth, Settings
│       │   └── services/    # Axios HTTP client wrappers
│       └── dist/            # Production static build output
└── packages/
    └── shared/              # Shared TypeScript interfaces, types, & constants
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Lucide React, Monaco Editor, React Router DOM
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), JWT, BcryptJS, Vitest, Supertest
- **Monorepo Tools**: npm workspaces, ts-node-dev, Concurrently

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/devforge`) or MongoDB Atlas URI

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/devforge-ai.git
   cd devforge-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` in `apps/api` to `apps/api/.env`:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

4. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - **Frontend UI**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`

---

## 🧪 Running Tests

Run the full automated test suite using Vitest:

```bash
npm run test
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
