var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Product  = require('../models/Product')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const product = await Product.find();
  res.render('index', { title: 'Coffeeno', product: product});
});

module.exports = router;
