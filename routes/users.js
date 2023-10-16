const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMe, editUserAbout,
} = require('../controllers/users');

router.get('/me', getUserMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), editUserAbout);

module.exports = router;
