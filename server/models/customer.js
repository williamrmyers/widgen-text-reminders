const mongoose = require('mongoose');

const Customer = mongoose.model('Customers', {
  first_name: {
    type: String,
    minlength: 1,
    trim: true
  },
  last_name: {
    type: String,
    minlength: 1,
    trim: true
  },
  phone: {
    type: String,
    minlength: 1,
    trim: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { Customer };
