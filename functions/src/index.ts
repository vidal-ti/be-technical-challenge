import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';

// Inicializar Firebase Admin (en Cloud Functions no necesita credenciales)
admin.initializeApp();

import authRoutes from './presentation/routes/auth.routes';
import taskRoutes from './presentation/routes/task.routes';

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Administrador de Tareas',
      version: '1.0.0',
      description: 'API para el desafío de administrador de tareas',
    },
    servers: [
      {
        url: 'https://us-central1-todoapp-challenge-b378a.cloudfunctions.net/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Ruta para que swagger-jsdoc lea las anotaciones @swagger en los archivos de rutas
  apis: ['./src/presentation/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(cors({ origin: true }));
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta Principal
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API Task Manager Challenge - Production',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      health: '/health',
    },
  });
});

app.get('/api-docs', (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.get('/docs', (req: Request, res: Response) => {
  const baseUrl = 'https://us-central1-todoapp-challenge-b378a.cloudfunctions.net/api';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Documentación de la API - Administrador de tareas</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui.css">
      <style>
        body { margin: 0; padding: 0; }
        .swagger-ui .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: '${baseUrl}/api-docs',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'production',
  });
});

// API Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 error
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Exportar api
export const api = functions.https.onRequest(app);
