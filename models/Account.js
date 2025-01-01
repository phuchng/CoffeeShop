const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
    address:
    {
        first_name: String,
        last_name: String,
        company: String,
        address: String,
        apartment: String,
        phone: String,
        isDefault: { type: Boolean, default: false },
    }
});

AccountSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

AccountSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('Account', AccountSchema);