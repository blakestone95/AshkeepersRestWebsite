import React from 'react';
import { Fido, SectionTile } from 'global/components';

const toRender = fetches => {
  const { data, fail } = fetches.event;

  if (!data) return <div>Loading...</div>;
  if (fail) return <div>Error loading</div>;

  const { title, content } = data.Event;
  return <SectionTile heading={title} text={content} />;
};

function ViewEvent(props) {
  const {
    match: {
      params: { eventId },
    },
  } = props;

  const fetchItems = {
    event: {
      path: `/api/events/${eventId}`,
    },
  };

  return <Fido fetchConfigs={fetchItems} render={toRender} />;
}

export default ViewEvent;
