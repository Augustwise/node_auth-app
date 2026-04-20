'use strict';

const authService = require('../services/auth.service');
const jwtService = require('../services/jwt.service');
const userService = require('../services/user.service');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    await authService.register({ name, email, password });

    res.status(201).json({
      message: 'Registered. Check your email for the activation link.',
    });
  } catch (error) {
    next(error);
  }
}

async function activate(req, res, next) {
  try {
    const { hash } = req.params;
    const user = await authService.activate(hash);

    const token = jwtService.sign({ id: user.id, email: user.email });
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const search = new URLSearchParams({
      accessToken: token,
      flow: 'registration',
    });

    res.redirect(`${clientUrl}/activation?${search.toString()}`);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email = '', password = '' } = req.body;
    const result = await authService.login({ email, password });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function requestPasswordReset(req, res, next) {
  try {
    const { email = '' } = req.body;

    await authService.requestPasswordReset({ email });

    res.json({
      message: 'If an account exists for that email, we sent a reset link.',
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token = '', password = '' } = req.body;

    await authService.resetPassword({ token, password });

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
}

async function confirmEmailChange(req, res, next) {
  try {
    const { token = '' } = req.params;
    const user = await userService.confirmEmailChange(token);
    const accessToken = jwtService.sign({ id: user.id, email: user.email });
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const search = new URLSearchParams({
      accessToken,
      flow: 'email-change',
    });

    res.redirect(`${clientUrl}/activation?${search.toString()}`);
  } catch (error) {
    next(error);
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = {
  register,
  activate,
  login,
  requestPasswordReset,
  resetPassword,
  confirmEmailChange,
};
