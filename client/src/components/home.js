import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Calender from './calender';

class Home extends React.Component {
  state = {
      token: undefined,
      appointments: [],
      messages: [],
      customers: [],
      events: []
  };
// Appointments handelers
getAppointments = () => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  axios.get('/appointments', authHeaders)
    .then((res) => {
      this.setState(() => ({ appointments: res.data.appointments }));
      // Events for calender
      const events = res.data.appointments.map(appointment => ({ id: appointment._id, title: appointment.text, start: new Date(appointment.start), end: new Date(appointment.start) }));
      this.setState(() => ({ events }));
      console.log(events);
    })
    .catch((error) => {
      console.log(error);
  });
}


postAppointments = () => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  const body = {
  	"text": "Meet with Jacky",
  	"start": new Date(),
    "end": moment().add(1, 'hours').toDate(),
  	"customer": "5b92f34860687de21bcdbea4"
  }

  axios.post('/appointment', body, authHeaders).then((res)=>{
      this.getAppointments();
  }).catch((error)=>{
    console.log(error);
  });
}
postAppointments2 = (e) => {
  e.preventDefault();

  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  const el = e.target.elements;

  const body = {
  	"text": el.text.value.trim(),
  	"start": el.start.value.trim(),
    "end": el.end.value.trim(),
  	"customer": el.customer.value.trim()
  }

  axios.post('/appointment', body, authHeaders).then((res)=>{
      this.getAppointments();
  }).catch((error)=>{
    console.log(error);
  });
}

patchAppointments = (id, name) => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  const body = {
  	"message":`Meet with ${name}`,
  	"date": 1536465944,
  	"customer": "5b92f34860687de21bcdbea4"
  }

  axios.patch(`/appointment/${id}`, body, authHeaders).then((res)=>{
      this.getAppointments();
  }).catch((error)=>{
    console.log(error);
  });
}

deleteAppointments = (id) => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  axios.delete(`/appointment/${id}`, authHeaders).then((res)=>{
      this.getAppointments();
  }).catch((error)=>{
    console.log(error);
  });
}

handleDelete = (e) => {
  const id = e.target.id;
  this.deleteAppointments(id);
}

getMessages = () => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  axios.get('/messages', authHeaders)
    .then((res) => {
      this.setState(() => ({ messages: res.data.messages }))
    })
    .catch((error) => {
      console.log(error);
  });
}

getCustomers = () => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };

  axios.get('/customers', authHeaders)
    .then((res) => {
      this.setState(() => ({ customers: res.data.customers }))
    })
    .catch((error) => {
      console.log(error);
  });
}

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.getAppointments();
      this.getMessages();
      this.getCustomers();
    }
  }

  render() {
    return (
      <div>
        {this.props.isAuthenticated?
          (
            <section className="section">
              <div className="hero">
                <div className="hero-body">
                  <div className="container has-text-centered content">
                    <h3>Appointments</h3>
                    <form onSubmit = {this.postAppointments2}>
                      <label> Text
                        <input name='text' type='text'></input>
                      </label>
                      <label> Start Time
                      <input name='start' type="datetime-local"></input>
                      </label>
                      <label>
                        End Time
                        <input name='end' type="datetime-local"></input>
                      </label>
                      <label> Customer
                      <input name='customer' type='text'></input>
                      </label>
                      <button type='submit' value="submit">Submit</button>
                    </form>
                      <ul>
                        {this.state.appointments.map(appointment => (<li key={appointment._id}><p>{appointment.text} at {appointment.start}<button id={appointment._id} onClick={this.handleDelete}>Delete</button></p></li>))}
                      </ul>
                      <button onClick={this.postAppointments}>Add Appointment</button>
                  </div>
                </div>
              </div>
              <Calender
                events={this.state.events}
                />
            </section>
          )
          :
          (
            <section className="section">
            <div className="hero">
              <div className="hero-body">
                <div className="container has-text-centered content">
                    <h1 className="big-header">Welcome!</h1>
                    <img src="https://media.giphy.com/media/CY9jl58dVtU2s/giphy.gif" alt="Cute Kitten"/>
                </div>
              </div>
            </div>
          </section>
          )
        }
      </div>
    );
  }
}

export default Home;
