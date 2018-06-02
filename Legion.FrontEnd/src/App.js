import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Components
import Home from 'Home';
import NavBar from 'NavBar';

import { ROUTE } from 'util/enums';

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
							<Redirect exact from="/" to={ROUTE.home} />

							<Route exact path={ROUTE.home} component={Home} />
							<Route exact path={ROUTE.tab2} component={Home} />
							<Route exact path={ROUTE.tab3} component={Home} />
							<Route exact path={ROUTE.tab4} component={Home} />
							<Route exact path={ROUTE.tab5} component={Home} />
						</Switch>
						<div className="legion-sidebar-right" />
					</div>
				</div>
			</BrowserRouter>
		);
	}
}
