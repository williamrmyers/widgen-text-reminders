import React from 'react';
import { Button, Checkbox, Form, Dropdown, Select, Header, Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import moment from 'moment';

class EventForm extends React.Component {
  componentWillMount() {
    // console.log('Cust!',this.props.customers);
    // const parsedCustomers = this.props.customers.map(customer => ({ value: customer._id, text: `${customer.first_name} ${customer.last_name} ${customer.phone}` }));
    // console.log(parsedCustomers);
    // this.setState({ parsedCustomers });
  }
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
      messages: this.state.message,
      customer: this.state.customer
    }
    this.props.postAppointments(body);
  }

  // handleChange = (e, { value }) => console.log({ value });
  selectCustomer = (e, { value }) => {
    this.setState({ customer: value });
    this.perdictName(value);
  };

  selectMessage = (e, { value }) => this.setState({ message: value });

  perdictName = (customer) => {
    const title = `Appointment with ${customer}.`;
      this.setState({ perdict: title });
  };

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
            <input placeholder='Appointment Name' name='title' defaultValue={this.state.perdict}/>
          </Form.Field>
          <Form.Field>
            <Checkbox defaultChecked name="notification" label='Send customer notification an hour before appointment' />
          </Form.Field>
          <Form.Field required control={Select} fluid search selection label='Customer' options={parsedCustomers} onChange={this.selectCustomer} placeholder='Customer' />
          <Form.Field required control={Select} fluid search selection label='Message' options={parsedMessages} onChange={this.selectMessage} placeholder='Message' />
          <Button secondary type='submit'>Submit</Button>
        </Form>
      </div>
    );
  }
}

export default EventForm;
