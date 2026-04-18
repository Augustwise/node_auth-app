'use strict';

const { User } = require('../models/user.model');

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

module.exports = {
  normalize,
  findByEmail,
  findByActivationToken,
  findById,
};
