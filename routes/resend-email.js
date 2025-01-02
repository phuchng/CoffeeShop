var express = require('express');
var account = require('../models/Account')
var router = express.Router();

var sendVerificationEmail = require('../config/sendEmail')

const crypto = require("crypto");

router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await account.findOne({ email: email });
        if (!user) {
          req.flash('error_msg', 'User not found.');
          return res.redirect('/login');
        }

        if (user.isVerified) {
            req.flash('success_msg', 'Email is already verified. Please log in.');
            return res.redirect('/login');
        }

        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const verificationLink = `https://coffee-shop-4rpa.onrender.com/verify-email?token=${token}`;
        const expirationTime = Date.now() + 6 * 60 * 1000;

        user.token = token;
        user.expirationTime = expirationTime;

        await user.save();
        sendVerificationEmail(email, verificationLink);

        req.flash('success_msg', 'Verification email sent! Please check inbox to complete.');
        return res.redirect('/login');
    }

 catch (error) {
    req.flash('error_msg', 'An error occurred while resending the email.');
    res.redirect('/login');
  }
})