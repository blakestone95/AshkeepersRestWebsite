import React, { PureComponent } from 'react';

export default class SectionTile extends PureComponent {
  render() {
    const { title, text } = this.props;
    return (
      <section className="ash-section">
        <div>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </section>
    );
  }
}
