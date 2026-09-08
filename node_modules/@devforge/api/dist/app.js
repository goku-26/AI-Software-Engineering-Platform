"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const github_routes_1 = __importDefault(require("./routes/github.routes"));
const code_routes_1 = __importDefault(require("./routes/code.routes"));
const agent_routes_1 = __importDefault(require("./routes/agent.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const security_routes_1 = __importDefault(require("./routes/security.routes"));
const git_routes_1 = __importDefault(require("./routes/git.routes"));
const observability_routes_1 = __importDefault(require("./routes/observability.routes"));
const dependency_routes_1 = __importDefault(require("./routes/dependency.routes"));
const infrastructure_routes_1 = __importDefault(require("./routes/infrastructure.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const response_formatter_1 = require("./utils/response-formatter");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Health check route
    app.get('/health', (_req, res) => {
        (0, response_formatter_1.sendSuccess)(res, { status: 'healthy', version: '1.0.0' });
    });
    // API v1 Routes
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/projects', code_routes_1.default);
    app.use('/api/projects', agent_routes_1.default);
    app.use('/api/projects', test_routes_1.default);
    app.use('/api/projects', security_routes_1.default);
    app.use('/api/projects', git_routes_1.default);
    app.use('/api/projects', observability_routes_1.default);
    app.use('/api/projects', dependency_routes_1.default);
    app.use('/api/projects', infrastructure_routes_1.default);
    app.use('/api/projects', project_routes_1.default);
    app.use('/api/github', github_routes_1.default);
    // Centralized Error Handling
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
