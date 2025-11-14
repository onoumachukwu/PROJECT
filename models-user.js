const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['driver','employer','admin'], required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: String,
  companyName: String, // for employers
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
