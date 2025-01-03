function isAuthenticated(req, res, next) {
    
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'You must be logged in first!')
    res.redirect('/login'); // Redirect to the login page if not authenticated
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/'); 
}

module.exports = { isAuthenticated, isAdmin };