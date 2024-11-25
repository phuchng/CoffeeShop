var express = require('express');
var account = require('../models/Account');
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  res.render('login', { title: 'Register' })
});

router.post('/', async function(req, res, next){
    const { email, password } = req.body;

    const findLogin = await account.findOne({ email: email });

    if (!findLogin)
    {
        return res.status(400).send('<script>alert("Email or Password is incorrect!"); window.location.href = "/login";</script>');
    }

    if (password !== findLogin.password)
    {
        return res.status(400).send('<script>alert("Email or Password is incorrect!"); window.location.href = "/login";</script>');
    }

    return res.send('<script>alert("Login Successful!"); window.location.href = "/";</script>');
})

module.exports = router;