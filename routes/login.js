var express = require('express');
var account = require('../models/Account');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  req.session.resendEmail = null;
  res.render('login', { title: 'Login' })
});

router.post('/', async function (req, res, next){ 
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // Failure: Set flash message explicitly for error_msg
      req.flash('error_msg', info.message); // info.message contains the error from the strategy
      return res.redirect('/login');
    }
    if (user.isBanned) {
      req.flash('error_msg', 'Your account has been banned.');
      return res.redirect('/login');
  }

    if (!user.isVerified) {
      // User is not verified: Set a custom flag or data in the session
      req.session.resendEmail = {
        email: user.email,
      };
      req.flash('error_msg', 'Your account has not been verified. Email has been sent to you.');
      return res.redirect('/login'); // Redirect to login, and the frontend will detect the unverified status
    }

    // Success: Log the user in
    req.logIn(user, (err) => {
      if (err) return next(err);

      // Redirect based on user role
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        req.flash('success_msg', `Welcome back, ${user.first_name}!`); // Customize success message
        return res.redirect('/');
      }
    });
  })(req, res, next);
});



module.exports = router;