import React from 'react';
import moment from 'moment';

import Header from './Header';
import DaysOfWeek from './DaysOfWeek';
import Month from './Month';

class Calendar extends React.Component {
  state = {
    currentMonth: new moment(), // Currently viewed month
    selectedDate: new moment(), // User selected date
  };

  render() {
    const { currentMonth, selectedDate } = this.state;
    return (
      <div className="ash-calendar">
        <Header current={currentMonth} />
        <DaysOfWeek />
        <Month month={currentMonth} select={selectedDate} />
      </div>
    );
  }
}
export default Calendar;
