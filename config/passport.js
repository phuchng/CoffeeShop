const Users = require('../models/Account')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await Users.findOne({ email: email });
        if (user == null) {
            return done(null, false, { message: 'Wrong email!' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Wrong password!' });
            }
        } catch (e) {
            return done(e)
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.HOST_URL + '/auth/google/callback',
        passReqToCallback: true
    },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists in your database
                let user = await Users.findOne({ 'google.id': profile.id });

                if (!user) {
                    // If not, create a new user with Google profile information
                    user = new Users({
                        google: {
                            id: profile.id,
                            email: profile.emails[0].value,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        },
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                        role: 'user' // Default role for new users
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

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
