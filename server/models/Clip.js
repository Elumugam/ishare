const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index: document expires at this specific date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clip', clipSchema);
