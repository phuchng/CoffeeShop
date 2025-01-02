var express = require('express');
var account = require('../models/Account');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  res.render('login', { title: 'Login' })
});

router.post('/', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error_msg', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect based on user role
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        req.flash('success_msg', `Welcome back, ${user.first_name}!`);
        return res.redirect('/');
      }
    });
  })(req, res, next); // Pass req, res, and next here
});

module.exports = router;