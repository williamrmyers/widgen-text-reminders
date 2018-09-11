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
const {Message} = require('./models/message');

let app = express();
const port = process.env.PORT;

app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-auth, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE, OPTIONS');
          next();
});


app.use(bodyParser.json());

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

app.post(`/customer`, authenticate, async (req, res) =>{
  let body = _.pick(req.body, ['first_name', 'last_name', 'email', 'phone']);
  // let customer = new Customer(body);

  const customer = new Customer({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    _owner: req.user._id
  });

  try {
        await customer.save().then((doc) => {
          res.status(200).send(doc);
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

app.get('/appointment/:id', authenticate, async (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  await Appointment.findOne({
    _id: id,
    _owner: req.user._id
  }).then((appointment) => {
    if (!appointment) {
      return res.status(404).send({});
    }
    // Success case
    res.status(200).send({appointment});
  }).catch((e) => {
    res.status(404).send();
  });
});

app.post(`/appointment`, authenticate, async (req, res) =>{
  let body = _.pick(req.body, ['date', 'message', 'customer']);
  // let customer = new Customer(body);

  const appointment = new Appointment({
    date: body.date,
  _owner: req.user._id,
  message: body.message,
  customer: body.customer
  });

  if (!ObjectID.isValid(appointment.customer)) {
    return res.status(404).send({});
  }

  try {
        await appointment.save().then((doc) => {
          res.status(200).send(doc);
        })
      }
  catch (e) {
    res.status(404).send({});
  }
});

app.patch(`/appointment/:id`, authenticate, async (req, res) => {
   const id = req.params.id;
   const body = _.pick(req.body, ['date', 'message', 'email', 'customer']);

   if (!ObjectID.isValid(id)) {
     return res.status(404).send({});
   }

  await Appointment.findOneAndUpdate({_id: id, _owner: req.user._id}, {$set: body}).then((doc)=>{
     if (!doc) {
       return res.status(404).send();
     }
     // success case
     res.send({doc});
   }).catch(()=>{
     res.status(400).send();
   })
});


app.delete(`/appointment/:id`, authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  try {
    const appointment = await Appointment.findOneAndRemove({
      _id: id,
      _owner: req.user._id
    });
    if (!appointment) {
      return res.status(404).send({});
    }
    res.status(200).send({appointment});
  } catch (e) {
    return res.status(400).send({});
  }
});

app.get('/appointments', authenticate, async (req, res) => {
  await Appointment.find({ _owner: req.user._id }).then((appointments)=>{
    res.send({appointments});
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

// Message Routes
// GET /message/:id (PAGINATION) (QUERY)
app.get('/message/:id', authenticate, (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Message.findOne({
    _id: id,
    _owner: req.user._id
  }).then((message) => {
    if (!message) {
      return res.status(404).send({});
    }
    // Success case
    res.status(200).send({message});
  }).catch((e) => {
    res.status(404).send();
  });
});

// GET /messages
app.get('/messages', authenticate, async (req, res) => {
  await Message.find({ _owner: req.user._id }).then((messages)=>{
    res.send({messages});
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

// POST /message
app.post(`/message`, authenticate, async (req, res) =>{
  const body = _.pick(req.body, ['title', 'message']);

  const message = new Message({
    title: body.title,
    message: body.message,
    _owner: req.user._id
  });

  try {
        await message.save().then((doc) => {
          res.status(200).send(doc);
        })
      }
  catch (e) {
    return res.status(404).send({});
  }
});
// PATCH /message
app.patch(`/message/:id`, authenticate, async (req, res) => {
   const id = req.params.id;
   const body = _.pick(req.body, [ 'message', 'title']);

   if (!ObjectID.isValid(id)) {
     return res.status(404).send({});
   }

  await Message.findOneAndUpdate({_id: id, _owner: req.user._id}, {$set: body}).then((doc)=>{
     if (!doc) {
       return res.status(404).send();
     }
     // success case
     res.send({doc});
   }).catch(()=>{
     res.status(400).send();
   })
});

// DELETE /message
app.delete(`/message/:id`, authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  try {
    const message = await Message.findOneAndRemove({
      _id: id,
      _owner: req.user._id
    });
    if (!appointment) {
      return res.status(404).send({});
    }
    res.status(200).send({message});
  } catch (e) {
    res.status(400).send({});
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
