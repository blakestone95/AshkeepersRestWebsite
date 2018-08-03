import React from 'react';
import Header from './Header';
import DaysOfWeek from './DaysOfWeek';
import Month from './Month';

class Calendar extends React.PureComponent {
  render() {
    return( 
      <div>
        <Header />
        <DaysOfWeek />
        <Month />
      </div>
    )
  }
}

export default Calendar;
