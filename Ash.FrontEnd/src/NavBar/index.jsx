import React from 'react';
import { NavLink } from 'react-router-dom';

import { PATHS } from 'util/paths';

class NavBar extends React.Component {
  render() {
    return (
      <header className="ash-navbar">
        <NavLink
          replace
          to={PATHS.Home.path}
          className="ash-tab"
          activeClassName="ash-selected"
        >
          Home
        </NavLink>
        <NavLink
          replace
          to={PATHS.AnnouncementBoard.path}
          className="ash-tab"
          activeClassName="ash-selected"
        >
          Announcements
        </NavLink>
        <NavLink
          replace
          to={PATHS.EventsCalendar.path}
          className="ash-tab"
          activeClassName="ash-selected"
        >
          Events
        </NavLink>
      </header>
    );
  }
}

export default NavBar;
