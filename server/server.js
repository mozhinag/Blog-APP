import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRoutes.js';
import { connectDB } from './config/db.js';
import errorHandler from './middlewares/postMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API routes
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// Error handler
app.use(errorHandler);

// Serve React client in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('Please set NODE_ENV=production'));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan
      .bgWhite.bold
  );
});
