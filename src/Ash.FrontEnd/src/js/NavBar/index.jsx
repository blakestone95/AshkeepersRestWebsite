import React from 'react';
import { NavLink } from 'react-router-dom';

import { PATHS } from 'util/paths';
import 'img/Ashkeepers_Rest_SVG_Logo_v1.svg';

class NavBar extends React.Component {
  render() {
    return (
      <header className="ash-navbar">
        <img
          className="ash-logo"
          src="/img/Ashkeepers_Rest_SVG_Logo_v1.svg"
          alt="Ashkeeper's Rest Logo"
        />
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
