const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  status: { type: String, enum: ['applied','accepted','rejected'], default: 'applied' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', appSchema);
