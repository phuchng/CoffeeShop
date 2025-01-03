var express = require('express');
var Account = require('../models/Account'); 
var bcrypt = require('bcrypt')
var router = express.Router();

router.get('/', async(req, res, next) => {
    const token = req.query.token;

    try {
        const user = await Account.findOne({ token: token, expirationTime: { $gt: Date.now()} })

        if (!user) {
            req.flash("error_msg", "Invalid or expired token.");
            return res.redirect("/forgot-password");
        }
        
        res.render('reset-password', { title: 'Reset Password'})
    }

    catch (error) {
        req.flash("error_msg", "Something went wrong.");
        res.redirect("/forgot-password");
      }
})

router.post('/', async(req, res, next) => {
    const token = req.query.token;
    const { newPassword, passwordConfirm } = req.body;

    try {
        const user = await Account.findOne({ token: token, expirationTime: { $gt: Date.now()} })

        if (!user) {
            req.flash("error_msg", "Invalid or expired token.");
            return res.redirect("/forgot-password");
        }
    }

    catch(error)
    {
        console.error(error);
        return res.status(500).send('<script>alert("Registration failed: Internal Server Error"); window.location.href = "/reset-password";</script>');
    }
})