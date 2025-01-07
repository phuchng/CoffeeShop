var express = require('express');
var Account = require('../models/Account'); 
var bcrypt = require('bcrypt')
var router = express.Router();

var getToken
router.get('/', async(req, res, next) => {
    const { token } = req.query;
    getToken = token;
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

router.post('/', async (req, res, next) => {
    const token  = getToken;
    const { newPassword, passwordConfirm } = req.body;

    try {
        const user = await Account.findOne({ token: token });

        if (!user) {
            req.flash("error_msg", "Invalid or expired token.");
            return res.redirect("/forgot-password");
        }

        if (newPassword !== passwordConfirm) {
            req.flash("error_msg", "Passwords do not match!");
            return res.redirect("/reset-password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await Account.updateOne(
            { token: token },
            { password: hashedPassword, token: null, expirationTime: null }
        );

        if (updateResult.nModified === 0) {
            req.flash("error_msg", "Failed to reset password. Please try again.");
            return res.redirect(`/reset-password?token=${token}`);
        }
        req.flash('success_msg', 'Password reset successfully!');
        res.redirect('/login');
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).send('<script>alert("Password reset failed: Internal Server Error"); window.location.href = "/reset-password";</script>');
    }
});
module.exports = router;