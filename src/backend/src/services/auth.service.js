'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { User } = require('../models/user.model');
const { ApiError } = require('../utils/ApiError');
const {
  validateName,
  validateEmail,
  validatePassword,
} = require('../utils/validate');
const userService = require('./user.service');
const mailService = require('./mail.service');

async function register({ name, email, password }) {
  const errors = {};

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (nameError) {
    errors.name = nameError;
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  const existing = await userService.findByEmail(email);

  if (existing) {
    throw ApiError.badRequest('Validation failed', {
      email: 'Email is already taken',
    });
  }

  const activationToken = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name: name.trim(),
    email,
    password: passwordHash,
    activationToken,
  });

  await mailService.sendActivationLink(email, activationToken);
}

async function activate(activationToken) {
  const user = await userService.findByActivationToken(activationToken);

  if (!user) {
    throw ApiError.notFound('Invalid activation token');
  }

  user.activationToken = null;
  await user.save();

  return user;
}

module.exports = { register, activate };
