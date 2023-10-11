const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');
const urlAddress = require('../utils/constants');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlAddress),
    trailerLink: Joi.string().required().pattern(urlAddress),
    thumbnail: Joi.string().required().pattern(urlAddress),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);

router.delete('/:idMovie', celebrate({
  params: Joi.object().keys({
    idMovie: Joi.string().required().length(24).hex(),
  }),
}), deleteMovies);

module.exports = router;
