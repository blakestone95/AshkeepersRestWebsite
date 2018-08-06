import React from 'react';
import Header from './Header';
import DaysOfWeek from './DaysOfWeek';
import Month from './Month';
import moment from 'moment';

class Calendar extends React.PureComponent {
  state = {
    currentMonth: new moment, // Currently viewed month
    selectedDate: new moment  // User selected date
  }

  render() {
    const { currentMonth, selectedDate } = this.state;

    return( 
      <div>
        <Header current={currentMonth} />
        <DaysOfWeek />
        <Month month={currentMonth} select={selectedDate} />
      </div>
    )
  }
}

export default Calendar;
