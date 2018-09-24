import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Header extends React.Component {
  state = {
    hambergerToggle: ""
  };

  toggleBerger = (state) => {
        this.setState(() => ({ hambergerToggle: this.state.hambergerToggle ? "" : 'is-active' }))
  }

  render() {
    return (
      <div>
        <section className="section">
        <nav className="navbar is-black is-fixed-top">
          <div className="navbar-brand">
            <div className="navbar-item">
              <NavLink to="/">
                <img src="acme.png" alt="A boilerplate App" width="112" height="28"/>
              </NavLink>
            </div>
            <div className="navbar-burger burger" onClick={this.toggleBerger} data-target="navbarExampleTransparentExample">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div id="navbarExampleTransparentExample" className={this.state.hambergerToggle + " navbar-menu"} >
            <div className="navbar-start"></div>
            <div className="navbar-end">
              <div className="navbar-item">

                  {this.props.isAuthenticated ?
                    (
                      <div className="field is-grouped">
                      <p className="control">
                        <button onClick={this.props.logOut} className="button Normal is-outlined">
                          <span>Logout</span>
                        </button>
                      </p>
                      <p className="control">
                        <NavLink to="customers">
                        <button className="button Normal is-outlined">
                          <span>Customers</span>
                        </button>
                        </NavLink>
                      </p>
                      <p className="control">
                        <NavLink to="messages">
                        <button className="button Normal is-outlined">
                          <span>Messages</span>
                        </button>
                        </NavLink>
                      </p>
                      <p className="control">
                        <NavLink to="settings">
                        <button className="button Normal is-outlined">
                          <span>Settings</span>
                        </button>
                        </NavLink>
                      </p>
                      </div>
                    ) :
                    (
                      <div className="field is-grouped">
                          <p className="control">
                            <NavLink to="login">
                            <button className="button Normal is-outlined">
                              <span>Login</span>
                            </button>
                          </NavLink>
                          </p>
                          <p className="control">
                          <NavLink to="signup">
                          <button className="button Normal is-outlined">
                            <span>Signup</span>
                          </button>
                          </NavLink>
                        </p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
        </nav>
      </section>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    activeItem: 'home'
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state

    return (
      <Menu size='small' inverted>
        <Menu.Item as={NavLink} to='/' >
          <img src='https://react.semantic-ui.com/logo.png' width='20px' />
        </Menu.Item>

        {this.props.authenticated ?
          (<Menu.Item name='Dashboard' active={activeItem === 'Dashboard'} as={NavLink} to='/' onClick={this.handleItemClick} />)
          : false
        }
        {this.props.authenticated ?
          (
            <Menu.Item
              name='contacts'
              active={activeItem === 'contacts'}
              onClick={this.handleItemClick}
              as={NavLink}
              to="customers"
            />
          )
          : false
        }

        <Menu.Menu position='right'>
          {this.props.authenticated ?
            (<Dropdown item text={`${this.props.user.first_name} ${this.props.user.last_name}`}>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to='settings'>Settings</Dropdown.Item>
                <Dropdown.Item onClick={this.props.logOut}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>)
            :
            (<Menu.Item as={NavLink} to='signup'>
              <Button color='teal'>Sign Up</Button>
            </Menu.Item>)}
        </Menu.Menu>
      </Menu>
    )
  }
}

export default App;
