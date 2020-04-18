import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Components
import NavBar from 'navigation/NavBar';
import Routing from './Routing';

import 'style.less';

export const history = createBrowserHistory();

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <hr className="ash-divider" />
      <main className="ash-main">
        <Routing />
      </main>
    </BrowserRouter>
  );
}
