import React from 'react';
import Week from './Week';
import moment from 'moment';
class Month extends React.PureComponent {
  state = {
    month: this.props.month,
    selected: this.props.selected,
  };
  createWeeks = month => {
    var weeks = [],
      date = month
        .clone()
        .startOf('month')
        .startOf('week'),
      // startDate = date.clone(),
      endDate = date.clone().add(1, 'M');
    while (date.isSameOrBefore(endDate, 'day')) {
      weeks.push(
        <span className="body" key={date.date()}>
          <Week month={date} selected={this.props.selected} />
        </span>
      );
      date = date.clone().add(1, 'w');
    }
    return weeks;
  };
  render() {
    return <div>{this.createWeeks(this.state.month)}</div>;
  }
}
export default Month;
