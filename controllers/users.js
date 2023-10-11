const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictingError = require('../errors/ConflictingError');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(201).send({
      email: user.email, _id: user._id, name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAbout = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: 'true', runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '365d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};
