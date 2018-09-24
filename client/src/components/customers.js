import React from 'react';
import { Container, Segment, Input, Header, Form } from 'semantic-ui-react'
import axios from 'axios';

class Customers extends React.Component {

  state = {
    customers: [],
    contactFormVisible: false
  }

  postCustomer = (body) => {
    const authHeaders = {
      headers: { 'x-auth': this.props.token }
    };

    axios.post('/customer', body, authHeaders).then((res)=>{
        this.getCustomers();
    }).catch((error)=>{
      this.error(error);
    });
  }

  handelPostCustomer = (e) => {
    const el = e.target.elements;
    const firstName = el.firstName.value.trim();
    const lastName = el.lastName.value.trim();
    const phone = el.phone.value.trim();
    const email = el.email.value.trim();
    if (phone) {
      this.postCustomer({first_name: firstName, last_name: lastName, phone, email});
      el.firstName.value = '';
      el.lastName.value = '';
      el.phone.value = '';
      el.email.value = '';
    }
  }

  getCustomers = () => {
    const authHeaders = {
      headers: {'x-auth': this.props.token }
    };

    axios.get('/customers', authHeaders)
      .then((res) => {
        this.setState(() => ({ customers: res.data.customers }))
      })
      .catch((error) => {
        console.log(error);
    });
  }
  toggleAddForm = (state) => {
    this.setState(() => ({ contactFormVisible: this.state.contactFormVisible ? false : true }))
  }

  componentWillMount() {
    this.getCustomers();
  }

  render() {
    return (
      <div>
      <Container text>
        {this.state.contactFormVisible ? (
        <div>
          <h2>Add Contact</h2>
          <Form onSubmit={this.handelPostCustomer}>
            <Form.Group widths='equal'>
              <Form.Input fluid name='firstName' label='First name' placeholder='First name' />
              <Form.Input fluid name='lastName' label='Last name' placeholder='Last name' />
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.Input fluid name='phone' type='phone' label='Phone' placeholder='Phone' />
              <Form.Input fluid name='email' type='email' label='Email'placeholder='Email' />
            </Form.Group>
            <Form.Button>Submit</Form.Button>
          </Form>
        </div>
        ): false}

        <h1>Contacts</h1>
        <Segment.Group raised>
          {this.state.customers.map(customer => (<Segment key={customer._id}>{customer.first_name} {customer.last_name}  {customer.phone}</Segment>))}
        </Segment.Group>
    </Container>
      <div className='addButtom'>
        <button onClick={this.toggleAddForm}>Add</button>
      </div>
    </div>
    );
  }
}

export default Customers;
