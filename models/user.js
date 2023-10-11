const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    unique: true,
    validate: {
      validator: function checkEmail(email) {
        return email && validator.isEmail(email);
      },
      message: 'Не корректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minlength: [2, 'Минимальное количество символов должно быть - 2'],
    maxlength: [30, 'Максимальное количество символов не должно превышать - 30'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function checkLogin(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
