var express = require('express');
var Account = require('../models/Account');
var Cart = require('../models/Cart')
var bcrypt = require('bcrypt')
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  res.render('register', { title: 'Register' })
});

router.post('/', async function(req, res, next){
    const { first_name, last_name, email, password, passwordAgain } = req.body;
    if (password !== passwordAgain)
    {
        return res.status(400).send('<script>alert("Invalid Confirmation!"); window.location.href = "/register";</script>');
    }
    try{
        const existingUser = await Account.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('<script>alert("Registration failed: User already exists!"); window.location.href = "/register";</script>');
        }   

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new Account({ first_name: first_name, last_name: last_name, password: hashedPassword, email: email })

        await newAccount.save();

        const newCart = new Cart({ account: newAccount._id })

        await newCart.save();
        return res.send('<script>alert("Registration complete!"); window.location.href = "/";</script>');
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send('<script>alert("Registration failed: Internal Server Error"); window.location.href = "/register";</script>');
    }
})

module.exports = router;