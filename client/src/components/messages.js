import React from 'react';
import { Form, Input, TextArea, Button } from 'semantic-ui-react'
import axios from 'axios';

class Messages extends React.Component {

  state = {
    messages: []
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
    const el = e.target.elements;
    const title = el.reminderTitle.value.trim();
    const message = el.reminderText.value.trim();
    if (title && message) {
      this.postMessage({ title, message});
      el.reminderTitle.value = '';
      el.reminderText.value = '';
    }
  }

  error = (e) => {
    alert(e);
  }

  componentWillMount() {
    this.getMessages();
  }

  render() {
    return (
      <div>
        <div>
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
            <Form.Field id='form-button-control-public' control={Button} content='Save' />
          </Form>
        </div>

        <ul>
          {this.state.messages.map(message => (<li key={message._id}> <h4>{message.title}</h4> <br></br> <p>{message.message}</p></li>))}
        </ul>
      </div>
    );
  }
}

export default Messages;
