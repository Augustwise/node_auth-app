'use strict';

const bcrypt = require('bcryptjs');

const { User } = require('../models/user.model');
const { ApiError } = require('../utils/ApiError');
const { validatePassword } = require('../utils/validate');

function normalize(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

function findByActivationToken(activationToken) {
  return User.findOne({ where: { activationToken } });
}

function findById(id) {
  return User.findByPk(id);
}

async function changePassword({ userId, oldPassword, newPassword }) {
  const errors = {};

  if (!oldPassword) {
    errors.oldPassword = 'Old password is required';
  }

  const newPasswordError = validatePassword(newPassword);

  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  const user = await findById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Validation failed', {
      oldPassword: 'Old password is incorrect',
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
}

module.exports = {
  normalize,
  findByEmail,
  findByActivationToken,
  findById,
  changePassword,
};
