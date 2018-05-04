import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from 'Home';
import 'style.less';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Home}/>
        </div>
      </BrowserRouter>
    );
  }
}
