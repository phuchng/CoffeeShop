var express = require('express');
var Account = require('../models/Account'); 
var router = express.Router();

var sendVerificationEmail = require('../config/sendEmail')

const crypto = require("crypto");

router.get('/', async(req, res) => {
    res.render('password', { title: 'Forgot Password?' })
})

router.post('/', async(req, res) => {
    const { email } = req.body;

    try{
        const user = await Account.findOne({ email: email });
        if (!user) {
            req.flash("error_msg", "No account with that email!");
            return res.redirect('/forgot-password');
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expirationTime = Date.now() + 6 * 60 * 1000;

        user.token = token;
        user.expirationTime = expirationTime;

        await user.save();

        const resetLink = `https://coffee-shop-4rpa.onrender.com/reset-password?token=${token}`;

        const message = `
        <p>To successfully change your password, please verify your email by clicking the link below: </p>
        <a href="${resetLink}">${resetLink}</a>
    `

        sendVerificationEmail(email, message);

        req.flash('success_msg', 'Verification sent! Check your email inbox!');
        return res.redirect('/login')
    }
    catch(error)
    {
        req.flash("error_msg", "Could not send the verification. Please try again.");
        return res.redirect('/forgot-password');
    }
})

module.exports = router;