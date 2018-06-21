import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Components
import NavBar from 'NavBar';

import { PATHS } from 'util/paths';

import 'style.less';

export const history = createHistory();

export default class App extends Component {
  render() {
    const routes = Object.values(PATHS).map(pathObj => (
      <Route
        exact
        path={pathObj.path}
        component={pathObj.component}
        key={pathObj.display}
      />
    ));

    return (
      <BrowserRouter>
        <div className="legion-body">
          <NavBar />
          <div className="legion-page-container">
            <div className="legion-sidebar-left" />
            <div className="legion-page-content">
              <Switch>
                <Redirect exact from="/" to={PATHS.Home.path} />

                {routes}
              </Switch>
            </div>
            <div className="legion-sidebar-right" />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
