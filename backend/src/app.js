import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)


app.get('/', (req, res) => {
  res.send("MzansiBuilds API is running");
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/projects', projectRoutes);
app.use('/api/projects', commentRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;