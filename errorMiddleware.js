'use strict';

const createError = require('http-errors');

module.exports = (err, req, res, next) => {
  console.error(err.message);

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
