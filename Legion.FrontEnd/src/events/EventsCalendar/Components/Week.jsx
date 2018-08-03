import React from 'react';
import Day from './Day';

class Week extends React.PureComponent {
  render() {
    return(
      <div>
        Render a single Week
        <Day />
      </div>
    )
  }
}

export default Week;
