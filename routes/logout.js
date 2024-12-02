var express = require('express');
var router = express.Router();


router.post('/', async function(req, res, next) {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash('success_msg', "Logged out successfully!");
        res.redirect('/');
    })
});

module.exports = router;