import React, { PureComponent } from 'react';
import Calendar from './Components/Calendar';
import './style.less'

class EventsCalendar extends PureComponent {
  render() {
    return (
      <div className='calendar'>
        <Calendar />
      </div>
    )
  }
}

export default EventsCalendar;
