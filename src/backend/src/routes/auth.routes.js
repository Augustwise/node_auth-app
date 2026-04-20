'use strict';

const express = require('express');
const authController = require('../controllers/auth.controller');
const { guestOnlyMiddleware } = require('../middlewares/guestOnlyMiddleware');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post(
  '/password-reset',
  guestOnlyMiddleware,
  authController.requestPasswordReset,
);
authRouter.post(
  '/password-reset/confirm',
  guestOnlyMiddleware,
  authController.resetPassword,
);
authRouter.get('/activate/:hash', authController.activate);

authRouter.get(
  '/email-change/confirm/:token',
  authController.confirmEmailChange,
);

module.exports = { authRouter };
