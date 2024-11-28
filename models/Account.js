const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

AccountSchema.virtual('id').get(function(){
  return this._id.toHexString();
})

AccountSchema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('Account', AccountSchema);
