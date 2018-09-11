import React from 'react';
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
      console.log(error);
  });
}

componentWillMount() {
  this.getMessages()
}

  render() {
    return (
      <div>
          <section className="section">
            <div className="hero">
              <div className="hero-body">
                <div className="container has-text-centered content">
                  <p>This is the Messages component.</p>
                    <ul>
                      {this.state.messages.map(message => (<li key={message._id}> <h4>{message.title}</h4> <br></br> <p>{message.message}</p></li>))}
                    </ul>
                </div>
              </div>
            </div>
          </section>
      </div>
    );
  }
}

export default Messages;
