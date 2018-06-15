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
    return (
      <BrowserRouter>
        <div className="legion-body">
          <NavBar />
          <div className="legion-page-container">
            <div className="legion-sidebar-left" />
            <Switch>
              <Redirect exact from="/" to={PATHS.home} />

              <Route
                exact
                path={PATHS.Home.path}
                component={PATHS.Home.component}
              />
              <Route
                exact
                path={PATHS.Tab2.path}
                component={PATHS.Tab2.component}
              />
              <Route
                exact
                path={PATHS.Tab3.path}
                component={PATHS.Tab3.component}
              />
              <Route
                exact
                path={PATHS.Tab4.path}
                component={PATHS.Tab4.component}
              />
              <Route
                exact
                path={PATHS.Tab5.path}
                component={PATHS.Tab5.component}
              />
            </Switch>
            <div className="legion-sidebar-right" />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
