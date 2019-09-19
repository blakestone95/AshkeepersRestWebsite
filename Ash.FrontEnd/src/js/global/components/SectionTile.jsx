import React from 'react';

const SectionTile = props => {
  const { heading, text } = props;

  return (
    <section className="ash-section">
      <div>
        <h1>{heading}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
};

// NOTE: Using React.memo here due to a bug in the react eslint plugin
//   giving a false-positive: https://github.com/yannickcr/eslint-plugin-react/issues/2324
export default React.memo(SectionTile);
