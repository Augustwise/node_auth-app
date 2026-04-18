'use strict';

const Nodemailer = require('nodemailer');

let transport;

function getTransport() {
  if (transport) {
    return transport;
  }

  const user = process.env.GMAIL_USER || process.env.MAIL_FROM_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      'GMAIL_USER (or MAIL_FROM_ADDRESS) and GMAIL_APP_PASSWORD' +
        ' are required to send emails through Gmail SMTP',
    );
  }

  transport = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  return transport;
}

function getSender() {
  const address = process.env.MAIL_FROM_ADDRESS || process.env.GMAIL_USER;

  if (!address) {
    throw new Error(
      'MAIL_FROM_ADDRESS or GMAIL_USER is required for the sender address',
    );
  }

  return {
    address,
    name: process.env.MAIL_FROM_NAME || 'Auth App',
  };
}

function send({ to, subject, text, html }) {
  return getTransport().sendMail({
    from: getSender(),
    to,
    subject,
    text,
    html,
  });
}

function sendActivationLink(email, hash) {
  const serverUrl = process.env.SERVER_URL || 'http://localhost:4000';
  const link = `${serverUrl}/activate/${hash}`;

  return send({
    to: email,
    subject: 'Activate your account',
    text: `Follow this link to activate your account: ${link}`,
    html: `
      <h2>Activate your account</h2>
      <p>Follow the link below to activate your account:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

module.exports = { sendActivationLink };
