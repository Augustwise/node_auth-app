'use strict';

const userService = require('../services/user.service');
const { ApiError } = require('../utils/ApiError');

async function me(req, res, next) {
  try {
    const user = await userService.findById(req.user.id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json(userService.normalize(user));
  } catch (error) {
    next(error);
  }
}

module.exports = { me };
