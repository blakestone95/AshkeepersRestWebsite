import React from 'react';
import Day from './Day';
import moment from 'moment';

class Week extends React.PureComponent {
  state = {
    date: this.props.date,
  }

  createDays = (date) => {
    let days = []
    date = date.clone()
    for (var i=0; i<7; i++) {
      days.push(<span><Day date={date} /></span>)
      date = date.clone().add(1, 'd')
    }
    return days;
  }

  render() {    
    return(
      <div>
        {this.createDays(this.state.date)}
      </div>
    )
  }
}

export default Week;
