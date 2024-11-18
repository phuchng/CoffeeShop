var express = require('express');
var account = require('../models/Account');
const Account = require('../models/Account');
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  res.render('register', { title: 'Register' })
});

router.post('/', async function(req, res, next){
    const { name, email, password, passwordAgain } = req.body;
    console.log(name);
    if (password !== passwordAgain)
    {
        return res.status(400).send('<script>alert("Invalid Confirmation!"); window.location.href = "/register";</script>');
    }
    try{
        const existingUser = await account.findOne({ name: name });
        if (existingUser) {
            return res.status(400).send('<script>alert("Registration failed: User already exists!"); window.location.href = "/register";</script>');
        }   

        const newAccount = new account({ name: name , password: password, email: email })

        await newAccount.save();
        res.send('<script>alert("Registration complete!"); window.location.href = "/";</script>');
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send('<script>alert("Registration failed: Internal Server Error"); window.location.href = "/register";</script>');
    }
})

module.exports = router;