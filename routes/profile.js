var express = require('express');
var router = express.Router();

function isAuthenticated(req, res, next) {
    console.log('isAuthenticated middleware running'); // Add a debug log
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('User not authenticated, redirecting...');
    res.redirect('/login');
  }

  router.get('/', (req, res, next) => {
    console.log('Route hit');
    res.render('profile', { title: 'Profile', user: req.user });
  });
  
  module.exports = router;

module.exports = router;