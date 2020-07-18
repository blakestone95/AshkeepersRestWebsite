import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

function SectionTile(props) {
  const { heading, date, author, text } = props;

  return (
    <section className="ash-tile">
      <div>
        <div className="ash-tile-header">
          <h1>{heading}</h1>
          <em className="ash-tile-author">by {author}</em>
        </div>
        <div className="ash-tile-date">
          <FontAwesomeIcon icon={faCalendar} />
          {moment(date).format('hh:mm a, MMM Do YYYY')}
        </div>
        <p>{text}</p>
      </div>
    </section>
  );
}

export default SectionTile;
