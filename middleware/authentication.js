function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirect to the login page if not authenticated
}

module.exports = isAuthenticated;