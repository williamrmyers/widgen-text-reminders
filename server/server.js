require('./config/config.js');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');


const {mongoose} = require('./db/mongoose');
const {authenticate} = require('./middleware/authenticate');
// Models
const {User} = require('./models/user');
const {Customer} = require('./models/customer');
const {Appointment} = require('./models/appointment');

let app = express();
const port = process.env.PORT;

app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-auth, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE, OPTIONS');
          next();
});


app.use(bodyParser.json());

app.get('/members', authenticate, (req, res)=>{
  res.send({
    text:`These kittens are only avalable to members!`,
    image:[
      'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
      'https://media.giphy.com/media/5kjsIIc47PKRq/giphy.gif',
      'https://media.giphy.com/media/GKnJPvJh59ywg/giphy.gif'
      ]
  });
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'first_name', 'last_name']);
  let user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send({
      _id: user._id,
      email: user.email,
      token
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post(`/users/login`, (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({
        _id: user._id,
        email: user.email,
        token
      });
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get(`/users/me`, authenticate, (req, res) => {
  res.send(req.user);
});

// Changes user data besides password
app.patch(`/users/me`, authenticate, (req, res) => {
  let body = _.pick(req.body, ['email', 'first_name', 'last_name']);

  return User.findOneAndUpdate({_id: req.user._id}, {$set: body}, {new: true}).then((user)=>{
  if (!user) {
    return res.status(404).send();
  }
  // success case
  res.send(req.user);

  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.patch(`/users/password_change`, authenticate, (req, res) => {

  let body = _.pick(req.body, ['password']);

  req.user.changePassword().then((password) => {
    // console.log(user);
    User.findOneAndUpdate({_id: req.user._id}, {$set: {password}}, {new: true}).then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send({user});
    })
  }).catch((e)=>{
      res.status(400).send(e);
    });
});


app.delete(`/users/me`, authenticate, (req, res) => {
  req.user.remove().then((user) => {
    res.status(200).send({user}, {id: req.user._id});
  }, () => {
    res.status(400).send();
  });
});

app.delete(`/users/me/token`, authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e)=>{
    res.status(400).send();
  });
});

// Customer routes
app.get('/customers', authenticate, async (req, res) => {
  await Customer.find({ _owner: req.user._id }).then((customers)=>{
    res.send({customers});
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.post(`/customer`, authenticate, (req, res) =>{
  // let body = _.pick(req.body, ['email', 'phone', 'first_name', 'last_name']);
  // let customer = new Customer(body);

  const customer = new Customer({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    _owner: req.user._id
  });

  try {
        customer.save().then((doc) => {
          return res.status(200).send(doc);
        })
      }
  catch (e) {
    return res.status(404).send({});
  }
});

app.patch(`/customer/:id`, authenticate, async (req, res) => {
   const id = req.params.id;
   const body = _.pick(req.body, ['first_name', 'last_name', 'email', 'phone']);

   if (!ObjectID.isValid(id)) {
     return res.status(404).send({});
   }

  await Customer.findOneAndUpdate({_id: id, _owner: req.user._id}, {$set: body}).then((doc)=>{
     if (!doc) {
       return res.status(404).send();
     }
     // success case
     res.send({doc});
   }).catch(()=>{
     res.status(400).send();
   })
});


app.delete(`/customer/:id`, authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  try {
    const customer = await Customer.findOneAndRemove({
      _id: id,
      _owner: req.user._id
    });
    if (!customer) {
      return res.status(404).send({});
    }
    res.status(200).send({customer});
  } catch (e) {
    return res.status(400).send({});
  }
});

app.post(`/appointment`, authenticate, (req, res) =>{
  // let body = _.pick(req.body, ['email', 'phone', 'first_name', 'last_name']);
  // let customer = new Customer(body);

  const appointment = new Appointment({
    date: req.body.date,
  _owner: req.user._id,
  message: req.body.message,
  customer: req.body.customer
  });

  if (!ObjectID.isValid(appointment.customer)) {
    return res.status(404).send({});
  }

  try {
        appointment.save().then((doc) => {
          res.status(200).send(doc);
        })
      }
  catch (e) {
    res.status(404).send({});
  }
});


// Server built react on production.
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../client/build');
  // Sets path for HTML
  app.use(express.static(publicPath));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, ()=>{
  console.log(`App started on port ${port}`);
});

module.exports = {app};
