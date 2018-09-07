import React from 'react';
import { NavLink} from 'react-router-dom';

const SubHeader = () => (
  <header className="subheader">
    <nav>
      <ul>
        <li><NavLink to="/" activeClassName="is-active" exact={true}>Calender</NavLink></li>
        <li><NavLink to="/customers" activeClassName="is-active" exact={true}>Customers</NavLink></li>
        <li><NavLink to="/messages" activeClassName="is-active">Messages</NavLink></li>
        <li><NavLink to="/settings" activeClassName="is-active">Settings</NavLink></li>
      </ul>
    </nav>
  </header>
);

export default SubHeader;
