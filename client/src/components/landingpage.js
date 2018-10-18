import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class LandingPage extends React.Component {

render () {
  return (
    <div>
        <header>
          <div className="overlay"></div>
          <video playsInline="playsInline" autoPlay="autoPlay" muted="muted" loop="loop">
            <source src="https://i.imgur.com/sWe6Gjd.mp4" type="video/mp4" />
          </video>
          <div className="container h-100">
            <div className="video-text">
                  <h1>Widgen</h1>
                  <p>Send text reminders to your patients about their appoinments and reduce no shows.</p>
                  <Button as={Link} to='signup' color='teal'>Sign Up</Button>
            </div>
          </div>
        </header>
    </div>
  )}
}
export default LandingPage;
