import React, { PureComponent } from 'react';
import SectionTile from 'global/SectionTile';

class Home extends PureComponent {
  render() {
    return (
      <div>
        This is the Home page
        <SectionTile title="Section Title" text="Text Text Text" />
      </div>
    );
  }
}

export default Home;
