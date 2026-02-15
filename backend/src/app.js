import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
