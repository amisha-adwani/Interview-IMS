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
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
