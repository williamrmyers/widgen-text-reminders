import React from 'react';
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
          <div>
              <section className="section">
                <div className="hero">
                  <div className="hero-body">
                    <div className="container has-text-centered content">
                      <p>This is the Customers component.</p>
                      <ul>
                        {this.state.customers.map(customer => (<li key={customer._id}>{customer.first_name} {customer.last_name} Number: {customer.phone}</li>))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
          </div>
      </div>
    );
  }
}

export default Customers;
