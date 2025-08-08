import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { PORT } from './config/env.js';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Rutas de la API
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
