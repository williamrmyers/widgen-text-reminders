import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-modal';

import Calender from './calender';
import EventForm from './event-form';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


class Home extends React.Component {
  state = {
      token: undefined,
      appointments: [],
      messages: [],
      customers: [],
      events: [],
      modalIsOpen: false,
      formStart: false,
      formEnd: false
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
      const events = res.data.appointments.map(appointment => ({ id: appointment._id, title: appointment.text, start: new Date(appointment.start), end: new Date(appointment.end) }));
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

postAppointments3 = (body) => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };

  axios.post('/appointment', body, authHeaders).then((res)=>{
      this.toggleModal();
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

handleDelete = (data) => {
  const id = data.id;
  console.log(id);
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
      this.setState(() => ({ customers: res.data.customers }));
    })
    .catch((error) => {
      console.log(error);
  });
}

createAppointment = (data) => {
  this.setState(() => ({ formStart: data.start, formEnd: data.end}));
  this.toggleModal();
  console.log('Created:',data);
}

modifyAppointment = (data) => {
  this.setState(() => ({ formStart: data.start, formEnd: data.end }));
  console.log(data);
  this.toggleModal();
}

closeModal = () => {
  this.setState(() => ({modalIsOpen: false}));
}

toggleModal = (state) => {
  this.setState(() => ({ modalIsOpen: this.state.modalIsOpen ? false : true }))
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
            <div>
                <Calender
                  events={this.state.events}
                  createAppointment={this.createAppointment}
                  modifyAppointment={this.modifyAppointment}
                  handleDelete={this.handleDelete}
                  />
                <Modal
                  isOpen={this.state.modalIsOpen}
                  // onAfterOpen={this.afterOpenModal}
                  // onRequestClose={this.closeModal}
                  style={customStyles}
                  contentLabel="Create or modify Appointment modal."
                >
                <EventForm
                  messages={this.state.messages}
                  customers={this.state.customers}
                  postAppointments={this.postAppointments3}
                  formStart={this.state.formStart}
                  formEnd={this.state.formEnd}
                  />
                  <button onClick={this.toggleModal}>close</button>
                </Modal>
            </div>
          )
          :
          (
            <section className="section">
            <div className="hero">
              <div className="hero-body">
                <div className="container has-text-centered content">
                    <h1 className="big-header">Welcome!</h1>
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
