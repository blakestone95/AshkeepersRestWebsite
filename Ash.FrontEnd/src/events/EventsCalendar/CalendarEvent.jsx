import React from 'react';
import moment from 'moment';
import { PATHS } from 'util/paths';

export default class CalendarEvent extends React.Component {
  render() {
    const { id, title } = this.props.data;
    return (
      <a className="calendar-event" href={`${PATHS.ViewEvent.path}/${id}`}>
        {title}
      </a>
    );
  }
}
