import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import { Container, Header, Form } from 'semantic-ui-react'

class Login extends React.Component {
  state = {
      error: undefined
  };
  handelSignup = (e, props) => {
    e.preventDefault();

    const formElements = e.target.elements;
    const email = formElements.email.value.trim();
    const password = formElements.password.value.trim();

    // // Submit to server
    axios.post('/users/login', {
      "email": email,
      "password": password
    })
      .then((response) => {
        this.props.handelSubmit(response);
        console.log(response);
      }).catch((e) => {
        console.log(`Error Logging in` + e);
        this.setState(() => ({ error: 'There was an error logging in please try again.' }));
      });
  }

  render() {
    return (
      <Container text textAlign='center'>
        <Header as='h2'>Login</Header>
        <Form size='small' onSubmit={this.handelSignup}>
            <Form.Input fluid name='email' label='Email' placeholder='email' />
            <Form.Input fluid name='password' type='password' label='Password' placeholder='password' />
            <p className="help">{this.state.error}</p>
          <Form.Button>Submit</Form.Button>
        </Form>
        { this.props.isAuthenticated ? <Redirect to='/' /> : null}
      </Container>
    );
  }
}

export default Login;
