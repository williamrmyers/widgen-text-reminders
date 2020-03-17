import React from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { Container, Header, Form, Button } from "semantic-ui-react";
import * as woopra from "./tracker/woopra";
import * as heap from "./tracker/heap";

class Signup extends React.Component {
  state = {
    error: undefined
  };

  handelSignup = (e, props) => {
    e.preventDefault();

    const formElements = e.target.elements;
    const firstName = formElements.firstName.value.trim();
    const lastName = formElements.lastName.value.trim();
    const email = formElements.email.value.trim();
    const password = formElements.password.value.trim();

    // // Submit to server
    axios
      .post("/users", {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password
      })
      .then(response => {
        this.props.handelSubmit(response);
        console.log("testing", response.data.email, response);
        // Add Identify code
        window.woopra.identify({
          email,
          firstName,
          lastName
        });
        window.woopra.track("Signup");
        // Heap
        window.heap.identify(email);
        window.heap.addUserProperties({
          email,
          firstName,
          lastName
        });
      })
      .catch(e => {
        console.log(`Error Logging in` + e);
        this.setState(() => ({
          error: "There was an error Signing up, please try again."
        }));
      });
  };
  render() {
    return (
      <Container text>
        <Header as="h1">Sign Up!</Header>
        <Form onSubmit={this.handelSignup}>
          <Form.Group widths="equal">
            <Form.Input
              required
              fluid
              label="First Name"
              name="firstName"
              placeholder="First Name"
            />
            <Form.Input
              required
              fluid
              label="Last Name"
              name="lastName"
              placeholder="Last Name"
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              required
              fluid
              label="Email"
              name="email"
              placeholder="email"
            />
            <Form.Input
              required
              fluid
              type="password"
              name="password"
              label="Password"
              placeholder="password"
            />
          </Form.Group>
          <Form.Input
            fluid
            label="Company Name"
            name="company"
            placeholder="Company Name"
          />
          <p className="help">{this.state.error}</p>
          <Form.Group>
            <Form.Button secondary>Submit</Form.Button>
            <Link to="login">
              <Button>Login</Button>
            </Link>
          </Form.Group>
        </Form>
        {this.props.isAuthenticated ? <Redirect to="/" /> : null}
      </Container>
    );
  }
}

export default Signup;
