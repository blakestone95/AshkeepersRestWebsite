import React from 'react';
import Week from './Week';

class Month extends React.PureComponent {
  render() {
    return(
      <div>
        Render a single Month
        <Week />
      </div>
    )
  }
}

export default Month;
