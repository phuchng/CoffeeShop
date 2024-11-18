var express = require('express');
var product = require('../models/Product')
var router = express.Router();

/* GET users listing. */
router.get('/:id', async function(req, res, next) {
  const productID = req.params.id;

  const productDetail = await product.findById(productID);
  res.render('details', { title: productDetail.name, productDetail: productDetail});
});

module.exports = router;
