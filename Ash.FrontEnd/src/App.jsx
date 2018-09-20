import React, { PureComponent } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Components
import NavBar from 'NavBar';

import { PATHS } from 'util/paths';

import 'style.less';

export const history = createHistory();

export default class App extends PureComponent {
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
        <div className="ash-body">
          <NavBar />
          <div className="ash-page-container">
            <div className="ash-sidebar-left" />
            <div className="ash-page-content">
              <Switch>
                <Redirect exact from="/" to={PATHS.Home.path} />

                {routes}
              </Switch>
            </div>
            <div className="ash-sidebar-right" />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
