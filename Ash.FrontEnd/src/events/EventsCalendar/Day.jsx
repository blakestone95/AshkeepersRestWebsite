import React from 'react';
import moment from 'moment';
import CalendarEvent from './CalendarEvent';

const FakeData = [
  {
    id: 'I',
    title: 'I',
    game: '',
    content: '',
    start: '',
    end: '',
  },
  {
    id: 'Am',
    title: 'Am',
    game: '',
    content: '',
    start: '',
    end: '',
  },
];

class Day extends React.PureComponent {
  state = {
    date: this.props.date,
  };
  render() {
    const { date } = this.state;
    let formattedDate = date.clone().format('D');
    const day = {
      name: date.format('ddd'),
      number: date.date(),
      date: date,
    };
    var tomorrow = date.clone().add(1, 'd');
    var yesterday = date.clone().subtract(1, 'd');
    return (
      <div>
        <span className="number">{formattedDate}</span>
        <span className="background">{formattedDate}</span>
        {FakeData.map(event => (
          <CalendarEvent key={event.id} data={event} />
        ))}
      </div>
    );
  }
}
export default Day;
