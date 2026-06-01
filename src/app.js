import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import healthRouter from './api/v1/router/health.router.js';
import authRouter from './api/v1/router/auth.router.js';
import {errorMiddleware}  from './api/v1/middleware/error.middleware.js';






const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/api/v1', healthRouter);
app.use('/api/v1', authRouter)


app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log('Server is running on port 3000');

});