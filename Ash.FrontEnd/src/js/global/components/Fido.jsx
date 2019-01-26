import React from 'react';

/* 
fetchItems = {
  someValidName: {
    path: 'api/some/path/to/endpoint',
    query: { param1: 'a', param2: 'b' },
    options: {
      method: 'get',

    }
  }
}
*/

const initialFetchState = {
  inFlight: false,
  success: false,
  fail: false,
  data: null,
};

const mapFetchItemsToState = fetchItems =>
  Object.keys(fetchItems).reduce((initState, fetchKey) => {
    initState[fetchKey] = initialFetchState;

    return initState;
  }, {});

class Fido extends React.Component {
  state = mapFetchItemsToState(this.props.fetchItems);

  dispatch = fetchItem => {};

  processResponse = fetchItem => {};

  onFailure = fetchItem => {};

  render() {
    const { fetchItems, render } = this.props;
    const { ...fetches } = this.state;

    return render(fetches);
  }
}

export default Fido;
