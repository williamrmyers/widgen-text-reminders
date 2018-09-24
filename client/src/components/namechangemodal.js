import React from 'react';
import Modal from 'react-modal';
import Confirmation from './reusableComponents/confirmation';
import { Button, Form } from 'semantic-ui-react';

class NameChangeModal extends React.Component {

  state = {
      newFirstName: false,
      newLastName: false,
      newEmail: false,
      confirmation: false
  }

  confirmedChange = () => {
    const newName = {
      firstName: this.state.newFirstName,
      lastName: this.state.newLastName,
      email: this.state.newEmail
    }
    this.props.changeNameOnServer(newName);
    this.hideConfirmation();
  }
  hideConfirmation = () => {
    this.setState(() => ({
      confirmation:false
    }))
  }
  displayConfirmation = () => {
    this.setState(() => ({
      confirmation:true
    }))
  }

  changeNameSubmit = (e) => {
    e.preventDefault();

    const newName = {
      firstName: e.target.elements.firstName.value.trim(),
      lastName: e.target.elements.lastName.value.trim(),
      email: e.target.elements.email.value.trim()
    }
    this.setState(() => ({
      newFirstName : newName.firstName,
      newLastName: newName.lastName,
      newEmail: newName.email
      })
    );
    // this.props.getNewNameFromModal(newName);
    this.displayConfirmation();

    e.target.elements.firstName.value = "";
    e.target.elements.lastName.value = "";
  }

  render () {

    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return (
      <Modal
      isOpen = {this.props.isOpen}
      contentLabel = 'example model'
      onRequestClose={this.props.toggleNameModal}
      style={customStyles}
      >

        {this.state.confirmation ?
          (
            <Confirmation
            yes = {this.confirmedChange}
            no = {this.hideConfirmation}
            confirmationMessage = 'Are you sure you want to change your contact info?'
            ariaHideApp={false}
            />)
          :
          (<Form onSubmit={this.changeNameSubmit}>
              <Form.Field>
                <label>First Name</label>
                <input defaultValue={this.props.firstName} name='firstName' placeholder='First Name' />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <input defaultValue={this.props.lastName} name='lastName' placeholder='Last Name' />
              </Form.Field>
              <Form.Field>
                <label>Email</label>
                <input defaultValue={this.props.email} name='email' placeholder='Email' />
              </Form.Field>
              <Form.Field>
                <label>Company</label>
                <input placeholder='Company' name='company'  />
              </Form.Field>
                <Button type='submit'>Submit</Button>
                <Button onClick={this.props.toggleNameModal} >Cancel</Button>
            </Form>)
          }
        </Modal>
      );
    }
}

export default NameChangeModal;
