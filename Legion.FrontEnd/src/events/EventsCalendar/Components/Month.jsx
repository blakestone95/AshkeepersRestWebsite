import React from 'react';
import Week from './Week';
import moment from 'moment';

class Month extends React.PureComponent {
  state = {
    month: this.props.month
  }

  createWeeks = (month) => {
    var weeks = [],
        date = month.clone().startOf('month').startOf('week'),
        nextMonth = date.clone().add(1, 'M'),
        done = false;
    while (!done) {
      weeks.push(<span><Week date={date} /></span>)
      date = date.clone().add(1, 'w')
      done = date.month() !== nextMonth.month()
    }
    
    return weeks
  }
  
  render() {
    return(
      <div>
        {this.createWeeks(this.state.month)}
      </div>
    )
  }
}

export default Month;
