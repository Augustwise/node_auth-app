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

async function changePassword(req, res, next) {
  try {
    const { oldPassword = '', newPassword = '' } = req.body;

    await userService.changePassword({
      userId: req.user.id,
      oldPassword,
      newPassword,
    });

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
}

async function changeName(req, res, next) {
  try {
    const { newName = '' } = req.body;

    await userService.changeName({ userId: req.user.id, newName });

    res.json({ message: 'Name changed successfully.' });
  } catch (error) {
    next(error);
  }
}

async function changeEmail(req, res, next) {
  try {
    const { password = '', newEmail = '' } = req.body;

    await userService.requestEmailChange({
      userId: req.user.id,
      password,
      newEmail,
    });

    res.json({
      message: 'Confirmation link sent to your new email address.',
    });
  } catch (error) {
    next(error);
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { me, changePassword, changeName, changeEmail };
