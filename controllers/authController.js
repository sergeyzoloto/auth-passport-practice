// controllers/authController.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/users');

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

async function addNewUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
}

const authenticateUser = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
});

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  addNewUser,
  authenticateUser,
};
