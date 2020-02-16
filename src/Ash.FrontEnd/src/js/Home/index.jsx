import React, { PureComponent } from 'react';
import { SectionTile } from 'global/components';

class Home extends PureComponent {
  render() {
    return (
      <div>
        <SectionTile title="Welcome!" text="Welcome to Ashkeepers Rest" />
      </div>
    );
  }
}

export default Home;
