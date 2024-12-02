var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('../config/ensureAuthenticated');

router.get('/', ensureAuthenticated, async function(req, res, next) {
    res.render('cart', { title: 'Cart' })
  });