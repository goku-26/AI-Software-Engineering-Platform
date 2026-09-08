import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import githubRoutes from './routes/github.routes';
import codeRoutes from './routes/code.routes';
import agentRoutes from './routes/agent.routes';
import testRoutes from './routes/test.routes';
import securityRoutes from './routes/security.routes';
import gitRoutes from './routes/git.routes';
import observabilityRoutes from './routes/observability.routes';
import dependencyRoutes from './routes/dependency.routes';
import infrastructureRoutes from './routes/infrastructure.routes';
import { errorHandler } from './middleware/error.middleware';
import { sendSuccess } from './utils/response-formatter';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check route
  app.get('/health', (_req: Request, res: Response) => {
    sendSuccess(res, { status: 'healthy', version: '1.0.0' });
  });

  // API v1 Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', codeRoutes);
  app.use('/api/projects', agentRoutes);
  app.use('/api/projects', testRoutes);
  app.use('/api/projects', securityRoutes);
  app.use('/api/projects', gitRoutes);
  app.use('/api/projects', observabilityRoutes);
  app.use('/api/projects', dependencyRoutes);
  app.use('/api/projects', infrastructureRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/github', githubRoutes);


  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
