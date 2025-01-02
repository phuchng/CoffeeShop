const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect based on user role
        if (req.user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    }
);

module.exports = router;