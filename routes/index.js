const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const signupRouter = require('./signup');
const singinRouter = require('./signin');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', signupRouter);
router.use('/signin', singinRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Данной страницы не существует'));
});

module.exports = router;
