const Users = require('../models/Account')
const bcrypt = require('bcrypt')

const LocalStrategy = require('passport-local').Strategy;

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await Users.findOne({ email: email });
        if (user == null) {
            return done(null, false, { message: 'Wrong email or password!' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Wrong email or password!' });
            }
        } catch (e) {
            return done(e)
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Users.findById(id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
}

module.exports = initialize;