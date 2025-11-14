const mongoose = require('mongoose');

const driverProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: String,
  licenseNumber: String,
  phone: String,
  location: String,
  portfolio: [ { url: String, name: String } ],
  ratings: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('DriverProfile', driverProfileSchema);
