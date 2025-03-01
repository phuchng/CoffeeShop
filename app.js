require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
var passport = require('passport')
var flash = require('connect-flash')
var session = require('express-session');

var adminRouter = require('./routes/admin');
var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var forgotPassword = require('./routes/forgot-password')
var verifyRoute = require('./routes/verify-email')
var resetRoute = require('./routes/reset-password')
var cartRouter = require('./routes/cart');
var authRouter = require('./routes/auth');
var orderRouter = require('./routes/order')
var profileRouter = require('./routes/profile')
var app = express();

var fetchCategories = require('./middleware/menu');
app.use(fetchCategories);

// Initialize Passport.js
require('./config/passport')(passport);

app.use(session({
    secret: process.env.SESSION_SECRET, // Use the secret from .env
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.isAuthenticated = req.isAuthenticated(); // Add authentication status
    res.locals.user = req.user || null;
    next();
})

// view engine setup

app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/admin', adminRouter);
app.use('/profile', profileRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/verify-email', verifyRoute);
app.use('/forgot-password', forgotPassword);
app.use('/reset-password', resetRoute);
app.use('/order', orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;