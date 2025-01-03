const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const { isAuthenticated } = require('../middleware/authentication');

function renderProfilePage(req, res, page, options = {}) {
    if (req.xhr) {
        res.render(`${page}`, { ...options, layout: false }); // No layout for AJAX
    } else {
        res.render(`${page}`, { ...options, layout: 'layouts/layoutProfile' }); // Use profile layout
    }
}
// Function to render admin pages with AJAX support
router.get('/', isAuthenticated, (req, res) => {
    renderProfilePage(req, res, 'profile', { user: req.user })

});

module.exports = router