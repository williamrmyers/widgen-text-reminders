const moment = require('moment');

const {mongoose} = require('.././db/mongoose');
const {authenticate} = require('.././middleware/authenticate');

const {User} = require('.././models/user');
const {Customer} = require('.././models/customer');
const {Appointment} = require('.././models/appointment');
const {Message} = require('.././models/message');

const {sendTextMessage} = require('./send-text-message');

// Remind
const remind = async () => {
  try {
    const appointmentsNextHour = await Appointment.find({ "reminderSent": false, "start":{ $gte: new Date(), $lt: moment().add(1, 'hour').toDate() } })
    .populate('customer')
    .populate('message')
    .exec();

    appointmentsNextHour.map(app => sendTextMessage(app.customer.phone, `${app.customer.first_name}! ${app.message.message}`, app._id) );

  } catch (e) {
    console.log(e);
  }
}

setInterval(remind, 120*1000);

module.exports = {remind};
