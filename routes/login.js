var express = require('express');
var account = require('../models/Account');
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  res.render('login', { title: 'Register' })
});

router.post('/', async function(req, res, next){
    const { email, password } = req.body;
})