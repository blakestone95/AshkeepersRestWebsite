import React from 'react';

const FakeData = [
  {
    id: 1,
    title: 'Event One',
    game: '',
    content: '',
    start: '',
    end: '',
  },
  {
    id: 2,
    title: 'Two Event',
    game: '',
    content: '',
    start: '',
    end: '',
  },
];

class ViewEvent extends React.Component {
  render() {
    const {
      match: {
        params: { eventId },
      },
    } = this.props;

    return (
      <div>
        {JSON.stringify(FakeData.find(event => event.id === Number(eventId)))}
      </div>
    );
  }
}

export default ViewEvent;
