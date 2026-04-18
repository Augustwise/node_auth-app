'use strict';

const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.get('/me', authMiddleware, userController.me);

module.exports = { userRouter };
