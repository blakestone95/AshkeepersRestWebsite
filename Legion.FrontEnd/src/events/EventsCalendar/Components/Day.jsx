import React from 'react';
import moment from 'moment';

class Day extends React.PureComponent {
  state = {
    date: this.props.date
  }

  render() {
    const date = this.state.date
    let formattedDate = date.clone().format('D')
    var day = {
      name: date.format('ddd'),
      number: date.date(),
      date: date
    }
    var tomorrow = date.clone().add(1, 'd');
    var yesterday = date.clone().subtract(1, 'd');
    return (
      <div>
        <span className='number'>{formattedDate}</span>
        <span className='background'>{formattedDate}</span>
      </div>
    )
  }
}

export default Day;
