import React from 'react';
import { Form, Input, TextArea, Button, Container, Divider, Dropdown } from 'semantic-ui-react'
import axios from 'axios';
import * as woopra from "./tracker/woopra";

class Messages extends React.Component {

  state = {
    messages: [],
    formVisible: false,
    editMessage: {}
  }

  getMessages = () => {
    const authHeaders = {
      headers: {'x-auth': this.props.token }
    };
  axios.get('/messages', authHeaders)
    .then((res) => {
      this.setState(() => ({ messages: res.data.messages }))
    })
    .catch((error) => {
      this.error(error);
    });
  }

  postMessage = (body) => {
    const authHeaders = {
      headers: { 'x-auth': this.props.token }
    };

    axios.post('/message', body, authHeaders).then((res)=>{
        this.getMessages();
    }).catch((error)=>{
      this.error(error);
    });
  }

  handelPostMessage = (e) => {
    e.preventDefault();

    const el = e.target.elements;
    const title = el.reminderTitle.value.trim();
    const message = el.reminderText.value.trim();
    if (title && message) {
      this.postMessage({ title, message});
      el.reminderTitle.value = '';
      el.reminderText.value = '';
    }
    window.woopra.track('Created Message');
  }

  deleteMessage = (id) => {
    const authHeaders = {
      headers: { 'x-auth': this.props.token }
    };
    axios.delete(`/message/${id}`, authHeaders).then((res)=>{
        this.getMessages();
    }).catch((error)=>{
      this.error(`Coundn't delete message.`, error);
      console.log(error);
    });
  }

  handelEdit = (e) => {
    this.toggleAddForm();
    console.log('handelEdit', e.target.id);
    const message = this.state.messages.filter(message => message._id === e.target.id)
    console.log(this.state.messages);
    console.log({message});
    this.setState(() => ({ editMessage: message[0]}));
  }

  handelDelete = (e) => {
    const id = e.target.id;
    console.log('handelDelete', id);
    this.deleteMessage(id);
  }

  error = (e) => {
    alert(e);
  }

  toggleAddForm = (e, state) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(() => ({ formVisible: this.state.formVisible ? false : true }));
  }

  openAddForm = (state) => {
    this.setState(() => ({ formVisible: true }));
  }
  closeAddForm = (state) => {
    this.setState(() => ({ formVisible: true }));
  }

  componentWillMount() {
    this.getMessages();
  }

  render() {
    return (
      <Container text>
        { this.state.formVisible ?
          (<div>
            <Form onSubmit={this.handelPostMessage}>
              <Form.Field
                id='form-input-control-reminder-title'
                control={Input}
                label='Reminder Title'
                placeholder='Reminder Title'
                name='reminderTitle'
                required
                width={6}
              />
              <Form.Field
                id='form-textarea-control-opinion'
                control={TextArea}
                label='Reminder Text'
                name='reminderText'
                placeholder='Reminder Text'
                required
              />
              <Form.Group>
                <Form.Field id='form-button-control-public' control={Button} content='Save' />
                <Button onClick={this.toggleAddForm}>Close</Button>
              </Form.Group>
            </Form>
            <Divider />
            </div>
          ): (
            <Button onClick={this.toggleAddForm} color='teal'>Add New Reminder Message</Button>
          )}

          <h1>Messages</h1>
          {this.state.messages.map(message => (<div key={message._id}>
            <Container>
              <Dropdown item text='Edit'>
                <Dropdown.Menu>
                  <Dropdown.Item id={message._id} onClick={this.handelEdit}>Edit</Dropdown.Item>
                  <Dropdown.Item id={message._id} onClick={this.handelDelete}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <h3>{message.title}</h3>
              <p>{message.message}</p>
            </Container><br />
            <Divider />
          </div>))}
      </Container>
    );
  }
}

export default Messages;
