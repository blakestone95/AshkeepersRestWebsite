import React from 'react';
import moment from 'moment';

class DaysOfWeek extends React.PureComponent {
  listDays = () => {
    var names = []
    for (var i=0; i<7; i++) {
      names.push(<span className='column column-center' key={i}>{moment().day(i).format('ddd')}</span>)
    }
    return names
  }
  render() {
    return(
      <div className='days-of-week row'>{this.listDays()}</div>
    )
  }
}

export default DaysOfWeek;
