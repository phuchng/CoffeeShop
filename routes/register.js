var express = require('express');
var Account = require('../models/Account');
var bcrypt = require('bcrypt')
var router = express.Router();

var sendVerificationEmail = require('../config/sendEmail')

const crypto = require("crypto");
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
        const verificationLink = `https://coffee-shop-4rpa.onrender.com/verify-email?token=${token}`;
       const message = `
            <p>Thank you for registering. Please verify your email by clicking the link below: </p>
            <a href="${verificationLink}">${verificationLink}</a>
        `
        const token = crypto.randomBytes(32).toString("hex");
        const expirationTime = Date.now() + 6 * 60 * 1000;
        const newAccount = new Account({ first_name: first_name, last_name: last_name, password: hashedPassword, email: email, isVerified: false, token: token, expirationTime: expirationTime })

        await newAccount.save();
        sendVerificationEmail(email, message);
        return res.send('<script>alert("Registration complete!"); window.location.href = "/login";</script>');
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send('<script>alert("Registration failed: Internal Server Error"); window.location.href = "/register";</script>');
    }
})


module.exports = router;