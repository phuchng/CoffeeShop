const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    google: {
        id: String,
        email: String,
        accessToken: String,
        refreshToken: String,
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address:
    {
        first_name: String,
        last_name: String,
        company: String,
        address: String,
        apartment: String,
        phone: String,
    },
    isVerified: { type: Boolean, default: false },
    token: String,
    expirationTime: Date,
    avatar: { type: String, default: 'default_avatar.png' },
});

AccountSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

AccountSchema.set('toJSON', {
    virtuals: true
})

const Account = mongoose.model('Account', AccountSchema)

module.exports = Account;