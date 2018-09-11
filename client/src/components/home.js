import React from 'react';
import axios from 'axios';

class Home extends React.Component {
  state = {
      token: undefined,
      appointments: [],
      messages: [],
      customers: []
  };
// Appointments handelers
getAppointments = () => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  axios.get('/appointments', authHeaders)
    .then((res) => {
      this.setState(() => ({ appointments: res.data.appointments }))
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
  	"message":"Meet with William",
  	"date": 1536465944,
  	"customer": "5b92f34860687de21bcdbea4"
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
                      <ul>
                        {this.state.appointments.map(appointment => (<li key={appointment._id}><p>{appointment.message} at {appointment.date}<button id={appointment._id} onClick={this.handleDelete}>Delete</button></p></li>))}
                      </ul>
                      <button onClick={this.postAppointments}>Add Appointment</button>
                  </div>
                </div>
              </div>
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
