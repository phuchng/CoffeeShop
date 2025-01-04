var express = require('express');
var Account = require('../models/Account');

var router = express.Router();

router.get('/', async(req, res) => {
    const { token } = req.query;

    try{
        const user = await Account.findOne({ token: token });

        if (!user){
            req.flash('error_msg', 'Token is invalid.');
            return res.redirect('/login');
        }

        user.isVerified = true;
        user.token = null;

        await user.save();

        req.flash('success_msg', 'Verification succeeded. You can now log in.');
        return res.redirect('/login');
    }
    catch (error) {
        res.status(500).send("An error occurred during verification.");
    }
})

module.exports = router;