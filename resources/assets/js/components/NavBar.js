import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE } from '../util/enums';

class NavBar extends Component {
    render() {
        return (
            <div className="legion-navbar">
                <Link to={ROUTE.home} replace>
                    Home
                </Link>
                <Link to={ROUTE.tab2} replace>
                    Tab2
                </Link>
                <Link to={ROUTE.tab3} replace>
                    Tab3
                </Link>
                <Link to={ROUTE.tab4} replace>
                    Tab4
                </Link>
                <Link to={ROUTE.tab5} replace>
                    Tab5
                </Link>
            </div>
        );
    }
}

export default NavBar;