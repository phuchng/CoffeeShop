var express = require('express');
var { Product } = require('../models/Product');
var Account = require('../models/Account');
var router = express.Router();
var { isAuthenticated } = require('../middleware/authentication');
const Order = require('../models/Order');

router.get('/', isAuthenticated, async (req, res, next) => {

});

router