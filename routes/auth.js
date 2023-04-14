// routes/auth.js

const express = require('express');
const router = express.Router();
const {
  checkNotAuthenticated,
  addNewUser,
  authenticateUser,
} = require('../controllers/authController');

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

// HTTP POST request for user login authentication
router.post('/login', checkNotAuthenticated, authenticateUser);

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

router.post('/register', checkNotAuthenticated, addNewUser);

router.delete('/logout', (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/login');
  });
});

module.exports = router;
