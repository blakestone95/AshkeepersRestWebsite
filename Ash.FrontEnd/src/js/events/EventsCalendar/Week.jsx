import React from 'react';
import Day from './Day';
import moment from 'moment';
class Week extends React.PureComponent {
  state = {
    month: this.props.month,
    select: this.props.selected,
  };
  onDateClick = day => {
    this.setState({
      select: day,
    });
  };
  createDays = (date, selected) => {
    let days = [];
    let day = date.clone();
    for (let i = 0; i < 7; i++) {
      days.push(
        <span
          className={`column cell ${
            !day.isSame(selected, 'month')
              ? 'disabled'
              : day.isSame(selected, 'day')
              ? 'selected'
              : ''
          }`}
          key={date.date() + i}
        >
          <Day date={day} />
        </span>
      );
      day = day.clone().add(1, 'd');
    }
    return days;
  };
  render() {
    return (
      <div className="row">
        {this.createDays(this.state.month, this.state.select)}
      </div>
    );
  }
}
export default Week;
