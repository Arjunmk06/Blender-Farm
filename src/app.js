import express from 'express';
import healthRouter from './api/v1/router/health.router.js';

const app = express();

app.use('/api/v1', healthRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');

});