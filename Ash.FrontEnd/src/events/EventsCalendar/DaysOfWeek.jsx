import React from 'react';
import moment from 'moment';

/* Renders the column titles as the days of the week Sunday to Saturday */
class DaysOfWeek extends React.PureComponent {
  listDays = () => {
    const names = [];
    for (var i = 0; i < 7; i++) {
      names.push(
        <span className="column column-center" key={'day' + i}>
          {moment()
            .day(i)
            .format('ddd')}
        </span>
      );
    }
    return names;
  };
  render() {
    return <div className="days-of-week row">{this.listDays()}</div>;
  }
}
export default DaysOfWeek;
