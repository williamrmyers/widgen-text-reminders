// mongoose
const {mongoose} = require('.././db/mongoose');
const {authenticate} = require('.././middleware/authenticate');
const {Appointment} = require('.././models/appointment');
// twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const sendTextMessage = (number, message, id) => {
  console.log(`Reminder sent to ${number}`, { message }, id);

  client.messages.create({
    body: message,
    to: number,  // Text this number
    from: process.env.MY_PHONE_NUMBER // From a valid Twilio number
  })
  .then((message) => {
    console.log(message.sid)
    Appointment.findOneAndUpdate({_id: id }, {$set: { 'reminderSent': true }})
    .catch((e) => console.log(e));
  })
  .catch((e) => {console.log(e)});
}

module.exports = {sendTextMessage};
