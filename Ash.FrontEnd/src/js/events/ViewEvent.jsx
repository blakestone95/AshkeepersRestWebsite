import React from 'react';
import { Fido } from 'global/components';

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

    const fetchItems = {
      event: {
        // TODO: changeover path when endpoints are written
        path: '/api/events', //`api/events/${eventId}`,
      },
    };

    return (
      <Fido
        fetchItems={fetchItems}
        render={fetches => {
          return <div>{JSON.stringify(fetches.event.data)}</div>;
        }}
      />
    );
  }
}

export default ViewEvent;
