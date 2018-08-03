import React from 'react';
import moment from 'moment';

class Day extends React.PureComponent {
  state = {
    date: this.props.date
  }
  render() {
    var day = {
        name:    this.state.date.format('ddd'),
        number:  this.state.date.date(),
        date:    this.state.date
    }
    var tomorrow =  this.state.date.clone().add(1, 'd');
    var yesterday = this.state.date.clone().subtract(1, 'd');
    return(
      <div>
        {day.date.format('ddd Do MMM YY')}
      </div>
    )
  }
}

export default Day;
