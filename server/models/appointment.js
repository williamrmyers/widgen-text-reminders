const mongoose = require('mongoose');

const Appointment = mongoose.model('appointments', {
  start: {
    type: Date,
    minlength: 1,
    required: true,
    trim: true
  },
  end: {
    type: Date,
    minlength: 1,
    required: true,
    trim: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customers'
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Messages'
  },
  text: {
    type: String,
    trim: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    trim: true
  }
});

module.exports = { Appointment };
