import React from 'react';
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
