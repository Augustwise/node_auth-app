'use strict';

const express = require('express');
const cors = require('cors');

const { authRouter } = require('./routes/auth.routes');
const { userRouter } = require('./routes/user.routes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.use('/', authRouter);
app.use('/users', userRouter);

app.use(errorMiddleware);

module.exports = { app };
