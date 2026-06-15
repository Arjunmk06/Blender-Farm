import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import healthRouter from './api/v1/router/health.router.js';
import authRouter from './api/v1/router/auth.router.js';
import projectRouter from './api/v1/router/project.router.js';
import {errorMiddleware}  from './api/v1/middleware/error.middleware.js';
import fileRouter from './api/v1/router/file.router.js';



const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/api/v1', healthRouter);
app.use('/api/v1', authRouter)
app.use('/api/v1', projectRouter)
app.use('/api/v1/', fileRouter)


app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log('Server is running on port 3000');

});