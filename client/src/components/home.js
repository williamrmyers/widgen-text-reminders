import React from 'react';
import axios from 'axios';

class Home extends React.Component {
  state = {
      token: undefined,
      appointments: []
  };

  getAppointments = () => {
    const authHeaders = {
      headers: {'x-auth': this.props.token }
    };
  axios.get('/appointments', authHeaders)
    .then((res) => {
      this.setState(() => ({ appointments: res.data.appointments }))
    })
    .catch((error) => {
      console.log(error);
  });
}

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.getAppointments();
    }
  }

  render() {
    return (
      <div>
        {this.props.isAuthenticated?
          (
            <section className="section">
              <div className="hero">
                <div className="hero-body">
                  <div className="container has-text-centered content">
                    <h3>Appointments</h3>
                      <ul>
                        {this.state.appointments.map(appointment => (<li key={appointment._id}><p>{appointment.message} at {appointment.date}</p></li>))}
                      </ul>
                  </div>
                </div>
              </div>
            </section>
          )
          :
          (
            <section className="section">
            <div className="hero">
              <div className="hero-body">
                <div className="container has-text-centered content">
                    <h1 className="big-header">Welcome!</h1>
                    <img src="https://media.giphy.com/media/CY9jl58dVtU2s/giphy.gif" alt="Cute Kitten"/>
                </div>
              </div>
            </div>
          </section>
          )
        }
      </div>
    );
  }
}

export default Home;
