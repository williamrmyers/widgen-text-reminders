import React from 'react';
import { Container, Segment } from 'semantic-ui-react'
import axios from 'axios';

class Customers extends React.Component {

  state = {
    customers: []
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

  componentWillMount() {
    this.getCustomers()
  }

  render() {
    return (
      <div>
        <h1>Contacts</h1>
        <Segment.Group raised>
          {this.state.customers.map(customer => (<Segment key={customer._id}>{customer.first_name} {customer.last_name} {customer.phone}</Segment>))}
        </Segment.Group>
      </div>
    );
  }
}

export default Customers;


// <ul>
//   {this.state.customers.map(customer => (<li key={customer._id}>{customer.first_name} {customer.last_name} Number: {customer.phone}</li>))}
// </ul>
