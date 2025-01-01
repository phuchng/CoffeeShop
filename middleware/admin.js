function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).render('error', { message: 'Forbidden', error: { status: 403 } }); // Or redirect to a specific error page
}

module.exports = isAdmin;