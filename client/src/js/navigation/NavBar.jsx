import React from 'react';
import { NavLink } from 'react-router-dom';

import { PATHS } from 'Routing';
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
          className="ash-nav"
          activeClassName="ash-selected"
        >
          <div className="ash-nav-label">Home</div>
        </NavLink>
        <NavLink
          replace
          to={PATHS.AnnouncementBoard.path}
          className="ash-nav"
          activeClassName="ash-selected"
        >
          <div className="ash-nav-label">Announcements</div>
        </NavLink>
        <NavLink
          replace
          to={PATHS.EventsCalendar.path}
          className="ash-nav"
          activeClassName="ash-selected"
        >
          <div className="ash-nav-label">Events</div>
        </NavLink>
      </header>
    );
  }
}

export default NavBar;
