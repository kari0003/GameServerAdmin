import jwt from 'jsonwebtoken';

import config from '../config';

export function jwtSign(data) {
  return new Promise((resolve, reject) => {
    jwt.sign(
    data,
    config.token.secret,
    { expiresIn: config.token.expires },
    (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });
}

export function jwtVerify(token) {
  return new Promise((resolve, reject) => jwt.verify(
    token,
    config.token.secret,
    (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    }
  ));
}

export function jwtVerifyMw(req, res, next) {
  jwtVerify(req.token)
  .then((decoded) => {
    req.client = decoded;
    return next();
  })
  .catch(err => {
    return next(err);
  });
}
