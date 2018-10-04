import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Components
import NavBar from 'NavBar';

import { PATHS } from 'util/paths';
import 'style.less';

export const history = createHistory();

export default class App extends React.PureComponent {
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
        <React.Fragment>
          <NavBar />
          <hr className="ash-divider" />
          <main className="ash-main">
            <Switch>
              <Redirect exact from="/" to={PATHS.Home.path} />

              {routes}
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
