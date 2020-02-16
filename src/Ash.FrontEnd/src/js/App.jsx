import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Components
import NavBar from 'NavBar';

import { PATHS } from 'util/paths';
import 'style.less';

export const history = createBrowserHistory();

export default class App extends React.PureComponent {
  render() {
    const routes = Object.values(PATHS).map(pathObj => (
      <Route
        exact
        path={pathObj.path + (pathObj.params ? pathObj.params : '')}
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
