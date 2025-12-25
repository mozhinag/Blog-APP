import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRoutes.js'
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import errorHandler from './middlewares/postMiddleware.js';

import path from 'path';



dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// app.get('/',(req, res, next) =>
//     res.send('Hello')
// )
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on this ${PORT} port`.cyan.bgWhite.underline.bold)
}
)
