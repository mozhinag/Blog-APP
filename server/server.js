import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRoutes.js';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import errorHandler from './middlewares/postMiddleware.js';
import path from 'path';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// API routes
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// Error handler
app.use(errorHandler);

// Serve React client in production
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Catch all unmatched routes
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan
      .bgWhite.underline.bold
  );
});
