import React from 'react';
import { useFido, SectionTile } from 'global/components';

function ViewEvent(props) {
  const {
    match: {
      params: { eventId },
    },
  } = props;
  const eventConf = {
    event: {
      path: `/api/events/${eventId}`,
    },
  };

  const { event } = useFido(eventConf);

  if (!event.data) return <div>Loading...</div>;
  if (event.fail) return <div>Error loading</div>;

  const { title, content } = event.data.Event;
  return <SectionTile heading={title} text={content} />;
}

export default ViewEvent;
