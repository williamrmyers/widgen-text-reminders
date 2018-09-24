import React from 'react';
import { Button } from 'semantic-ui-react'

const Confirmation = (props) => (
  <div>
    <div className="has-text-centered content">
    <h4>{props.confirmationMessage}</h4>
      <Button color='red' onClick = {props.yes}>Yes</Button>
      <Button onClick = {props.no}>No</Button>
    </div>
  </div>
);

export default Confirmation;
