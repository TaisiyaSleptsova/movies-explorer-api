const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    },
  )
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.idMovie)
    .orFail(() => new NotFoundError('Фильма с указанным id не существует'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Удаление фильмов другого пользователя не возможно');
      } Movie.deleteOne(movie)
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('проверьте корректность указанного id'));
      } else {
        next(err);
      }
    });
};
