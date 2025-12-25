import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRoutes.js';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import errorHandler from './middlewares/postMiddleware.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


if (process.env.NODE_ENV === 'production') {
  // Serve static files from client/dist
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Catch-all route
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan
      .bgWhite.underline.bold
  );
});
