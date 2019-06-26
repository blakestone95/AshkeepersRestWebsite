import React from 'react';

export default React.memo(function SectionTile(props) {
  const { heading, text } = props;

  return (
    <section className="ash-section">
      <div>
        <h1>{heading}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
});
