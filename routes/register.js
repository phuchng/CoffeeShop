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
        const token = crypto.randomBytes(32).toString("hex");
        const verificationLink = `http://localhost:2000/verify-email?token=${token}`;
       const message = `
         <html>
            <body>
                <p>Thank you for registering. Please verify your email by clicking the link below: </p>
                <a href="${verificationLink}">Click here now!</a>
            </body>
        </html>
        `
        const newAccount = new Account({ first_name: first_name, last_name: last_name, password: hashedPassword, email: email, isVerified: false, token: token })

        await newAccount.save();
        sendVerificationEmail(email, message);
        req.flash('success_msg', "Registration complete! Don't forget to verify your account!");
        res.redirect('/login')
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send('<script>alert("Registration failed: Internal Server Error"); window.location.href = "/register";</script>');
    }
})


module.exports = router;