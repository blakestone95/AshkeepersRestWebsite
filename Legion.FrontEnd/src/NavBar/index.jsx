import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { PATHS } from 'util/paths';

class NavBar extends Component {
  render() {
    return (
      <div className="legion-navbar">
        <Link to={PATHS.Home.path} replace>
          {PATHS.Home.display}
        </Link>
        <Link to={PATHS.Tab2.path} replace>
          {PATHS.Tab2.display}
        </Link>
        <Link to={PATHS.Tab3.path} replace>
          {PATHS.Tab3.display}
        </Link>
        <Link to={PATHS.Tab4.path} replace>
          {PATHS.Tab4.display}
        </Link>
        <Link to={PATHS.Tab5.path} replace>
          {PATHS.Tab5.display}
        </Link>
      </div>
    );
  }
}

export default NavBar;
