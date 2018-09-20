import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { PATHS } from 'util/paths';

class NavBar extends PureComponent {
  render() {
    return (
      <div className="ash-navbar">
        <Link to={PATHS.Home.path} replace>
          {PATHS.Home.display}
        </Link>
        <Link to={PATHS.AnnouncementBoard.path} replace>
          {PATHS.AnnouncementBoard.display}
        </Link>
        <Link to={PATHS.EventsCalendar.path} replace>
          {PATHS.EventsCalendar.display}
        </Link>
        <Link to={PATHS.CreateEvent.path} replace>
          {PATHS.CreateEvent.display}
        </Link>
      </div>
    );
  }
}

export default NavBar;
