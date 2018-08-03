import React from 'react';
import Header from './Header';
import DaysOfWeek from './DaysOfWeek';
import Month from './Month';
import moment from 'moment';

class Calendar extends React.PureComponent {
  state = {
    currentMonth: new moment,
    selectedDate: new moment
  }

  render() {
    return( 
      <div>
        <Header current={this.state.currentMonth} selected={this.state.selectedDate} />
        <DaysOfWeek />
        <Month month={this.state.currentMonth}/>
      </div>
    )
  }
}

export default Calendar;
