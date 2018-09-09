const mongoose = require('mongoose');

const Message = mongoose.model('Messages', {
  title: {
    type: String,
    minlength: 1,
    trim: true
  },
  message: {
    type: String,
    minlength: 1,
    trim: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { Message };
