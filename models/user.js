const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const Unauthorized = require('../errors/Unauthorized');
// const urlAddress = require('../utils/constants');

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
    minlength: [2, 'Минимальное количество символов должно быть - 2'],
    maxlength: [30, 'Максимальное количество символов не должно превышать - 30'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);