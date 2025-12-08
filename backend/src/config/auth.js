// src/config/auth.js
const jwt = require('jsonwebtoken');

const authConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = authConfig;