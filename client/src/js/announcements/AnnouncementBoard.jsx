import React from 'react';
import { useFido, Loading, SectionTile } from 'components';

const config = { path: '/api/announcements' };

function AnnouncementBoard(/* props */) {
  const [announcements] = useFido(config);

  return (
    <>
      <h1>Announcements</h1>
      <Loading isLoading={announcements.inFlight}>
        {/* Known bug in eslint-plugin-react 
            https://github.com/yannickcr/eslint-plugin-react/issues/2571
            2020-5-2 */}
        {/* eslint-disable-next-line react/display-name */}
        {announcements.data?.Announcements.map((announcement) => {
          const { id, title, created_at, user_id, content } = announcement;
          return (
            <SectionTile
              key={id}
              heading={title}
              date={created_at}
              author={user_id}
              text={content}
            />
          );
        }) || null}
      </Loading>
    </>
  );
}

export default AnnouncementBoard;
