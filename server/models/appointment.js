const mongoose = require('mongoose');

const Appointment = mongoose.model('appointments', {
  date: {
    type: Number,
    minlength: 1,
    required: true,
    trim: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId
  },
  message: {
    type: String,
    trim: true,
    minlength: 1
  }
});

module.exports = { Appointment };
