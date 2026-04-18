'use strict';

const authService = require('../services/auth.service');
const jwtService = require('../services/jwt.service');

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

    res.redirect(`${clientUrl}/activation?accessToken=${token}`);
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

module.exports = { register, activate, login };
