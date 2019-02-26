import React from 'react';
import { Fido } from 'global/components';

const fetchItems = {
  event: {
    // TODO: changeover path when endpoints are written
    path: '/api/events', //`api/events/${eventId}`,
  },
};

const toRender = fetches => {
  return <div>{JSON.stringify(fetches.event.data)}</div>;
};

class ViewEvent extends React.Component {
  render() {
    const {
      match: {
        params: { eventId },
      },
    } = this.props;

    return <Fido fetchConfigs={fetchItems} render={toRender} />;
  }
}

export default ViewEvent;
