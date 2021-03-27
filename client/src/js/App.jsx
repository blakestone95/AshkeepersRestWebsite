import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Components
import NavBar from 'navigation/NavBar';
import Routing from './Routing';

import 'style.scss';

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
