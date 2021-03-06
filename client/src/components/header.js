import React from "react";
import { NavLink, Link } from "react-router-dom";
import { createMemoryHistory as createHistory } from "history";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import * as woopra from "./tracker/woopra";
import * as heap from "./tracker/heap";

class Header extends React.Component {
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      window.woopra.track();
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Menu size="small" inverted>
        <Menu.Item as={Link} to="/">
          <img
            src="https://react.semantic-ui.com/logo.png"
            alt="Logo"
            width="20px"
          />
        </Menu.Item>

        {this.props.authenticated ? (
          <Menu.Item
            name="Dashboard"
            activeClassName="active"
            as={NavLink}
            to="/"
            exact
          />
        ) : (
          false
        )}
        {this.props.authenticated ? (
          <Menu.Item
            name="Contacts"
            as={NavLink}
            to="/customers"
            activeClassName="active"
            exact
          />
        ) : (
          false
        )}
        {this.props.authenticated ? (
          <Menu.Item
            name="Messages"
            as={NavLink}
            to="/messages"
            activeClassName="active"
            exact
          />
        ) : (
          false
        )}
        <Menu.Menu position="right">
          {this.props.authenticated ? (
            <Dropdown
              item
              text={`${this.props.user.first_name} ${this.props.user.last_name}`}
            >
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="settings">
                  Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={this.props.logOut}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Menu.Item as={NavLink} to="signup">
              <Button color="teal">Sign Up</Button>
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
