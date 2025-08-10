import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import { swaggerSpec } from './config/swagger';
import authRoutes from './presentation/routes/auth.routes';
import taskRoutes from './presentation/routes/task.routes';

const app = express();

// Middlewares de seguridad y optimización
app.use(
  cors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Iniciar el servidor
app.listen(config.PORT, () => {
  console.log(`
    Server is running!
    Listening on port ${config.PORT}
    Swagger docs: http://localhost:${config.PORT}/api-docs
    Health check: http://localhost:${config.PORT}/health
    Environment: ${config.NODE_ENV}
  `);
});

export default app;
