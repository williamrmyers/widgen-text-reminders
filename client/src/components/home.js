import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import Calender from './calender';
import EventForm from './event-form';
import LandingPage from './landingpage';

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
      formEnd: false,
      appointment: false
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

getAppointmentById = (id) => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  axios.get(`/appointment/${id}`, authHeaders)
    .then((res) => {
      this.setState(() => ({ appointment: res.data.appointment }));
    })
    .catch((error) => {
      console.log(error);
  });
}

postAppointment = (body) => {
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

patchAppointment = (body) => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  const id = body.id;

  axios.patch(`/appointment/${id}`, body, authHeaders).then((res)=>{
      this.toggleModal();
      this.getAppointments();
  }).catch((error)=>{
    console.log(error);
  });
}

deleteAppointment = (id) => {
  const authHeaders = {
    headers: { 'x-auth': this.props.token }
  };
  axios.delete(`/appointment/${id}`, authHeaders).then((res)=>{
      this.closeModal();
      this.getAppointments();
  }).catch((error)=>{
    console.log(error);
  });
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
  // Check if there are Customers and Messages.
  if (this.state.messages.length === 0 || this.state.customers.length === 0) {
    alert(`You need to add at least one Message and one Contact to create an Appointment`);
  } else {
    // Clears the modify appointment data
    this.setState(() => ({appointment: false }));
    this.setState(() => ({ formStart: data.start, formEnd: data.end}));
    this.toggleModal();
    console.log('Created:',data);
  }
}

modifyAppointment = (data) => {
  this.setState(() => ({ formStart: data.start, formEnd: data.end}));
  console.log(data);
  this.getAppointmentById(data.id);
  this.toggleModal();
}

closeModal = () => {
  this.setState(() => ({modalIsOpen: false }));
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
                  onRequestClose={() => console.log(`onRequestClose`)}
                >
                <EventForm
                  messages={this.state.messages}
                  customers={this.state.customers}
                  postAppointment={this.postAppointment}
                  patchAppointment={this.patchAppointment}
                  formStart={this.state.formStart}
                  formEnd={this.state.formEnd}
                  toggleModal={this.toggleModal}
                  appointment={this.state.appointment}
                  closeModal={this.closeModal}
                  deleteAppointment={this.deleteAppointment}
                  />
                </Modal>
            </div>
          )
          :
          (
            <div>
              <LandingPage />
            </div>
          )
        }
      </div>
    );
  }
}

export default Home;
