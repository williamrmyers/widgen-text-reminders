import React from 'react';
import { Button, Checkbox, Form, Dropdown, Select, Header, Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import moment from 'moment';

class EventForm extends React.Component {
  componentWillMount() {}
  state = {
    perdict: "",
  }

  handelSubmit = (e, { value }) => {
    const el = e.target.elements;
    const notification = el.notification.checked;
    const text = el.title.value.trim();
    console.log(notification, text, this.state.customer, this.state.message);

    const body = {
      text,
      start: this.props.formStart,
      end: this.props.formEnd,
      message: this.state.message,
      customer: this.state.customer
    }
    // If the appointment object exists in props we patch the appointment, otherwise we create a new one.
    const appointment = this.props.appointment
     if (appointment) {
       body.id = appointment._id;
       this.props.patchAppointment(body);
     } else {
       this.props.postAppointment(body);
     }
  }

  // handleChange = (e, { value }) => console.log({ value });
  selectCustomer = (e, { value }) => {
    this.setState({ customer: value });
  };

  selectMessage = (e, { value }) => this.setState({ message: value });

  render() {
    // Parses the arrays for forms
    const parsedCustomers = this.props.customers.map(customer => ({ value: customer._id, text: `${customer.first_name} ${customer.last_name} ${customer.phone}` }));
    const parsedMessages = this.props.messages.map(message => ({ value: message._id, text: message.title }));

    return (
      <div>
          <Header as='h3' block>
            {moment(this.props.formStart).format('LLLL')}
          </Header>
          <Header as='h3' block>
            {moment(this.props.formEnd).format('LLLL')}
          </Header>
        <Form onSubmit = {this.handelSubmit}>
          <Form.Field>
            <label>Appointment Name</label>
            <input placeholder='Appointment Name'  autoComplete="false" defaultValue={this.props.appointment? this.props.appointment.text: null} name='title' />
          </Form.Field>
          <Form.Field>
            <Checkbox defaultChecked name="notification" label='Send customer notification an hour before appointment' />
          </Form.Field>
            <Form.Field required control={Select} fluid search selection label='Customer' defaultValue={this.props.appointment?this.props.appointment.customer._id:null}  options={parsedCustomers} onChange={this.selectCustomer} placeholder='Customer' />
            <Form.Field required control={Select} fluid search selection label='Message' defaultValue={this.props.appointment?this.props.appointment.message._id:null}  options={parsedMessages} onChange={this.selectMessage} placeholder='Message' />
          <Button secondary type='submit'>Submit</Button>
          <Button onClick={this.props.closeModal} >Close</Button>
        </Form>
      </div>
    );
  }
}

export default EventForm;
