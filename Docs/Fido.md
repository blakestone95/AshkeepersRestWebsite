# Fido usage examples

See Fido file for the fetch config object structure

## `fetchConfig` structure

```js
const fetchConfig = {
  fetchMyData: {
    // HTTP request url path
    path: '/some/path/to/resource',
  
    // HTTP request url query string
    // Example is translated to "?mouse=Jerry&cheese=swiss" before fetch is dispatched
    query: {
      mouse: 'Jerry',
      cheese: 'swiss'
    },
  
    // HTTP request body
    // JSON object to include as the request body
    // String literals work too
    payload: {
      some: {
        json: ['object']
      }
    },
  
    options: {
      // HTTP request method
      // Accepts case-insensitive string
      // Fido also exports the HTTP_METHODS enumeration object (keys are lowercase)
      method: HTTP_METHODS.get, // default
  
      // flag - dispatch HTTP request immediately
      // Will work whether Fido mounts with this option set on configs, or the a new config with this option is added after Fido is mounted
      // Setting this option on an existing config when Fido is already mounted does nothing
      fetchImmediately: true, // default
  
      // flag - preserve old data when a new fetch request is sent
      // If false, the fetchMyData.data value will be set to null every time .call() is called
      preservePreviousData: true // default
    }
  }
}
```

## Quick and dirty get

This is the easiest way to write a component that uses Fido:

```jsx
import Fido from 'global/components/Fido';

class MyComponent extends React.Component {
  render() {
    return (
      <Fido
        fetchConfigs={{
          fetchMyData: {
            path="/api/getMyData"
          }
        }}
        render={fetches => {
          const { fetchMyData } = fetches;

          if (fetchMyData.inFlight) {
            return <div>Loading...</div>;
          }

          if (fetchMyData.success) {
            return <div>{fetchMyData.data}</div>;
          }

          return <div>No data</div>
        }}
      />
    );
  }
}
```

This pattern is fine for small/cheap renders, but be aware that Fido will re-render on every parent component update.  For more complicated or expensive renders, define the `fetchConfigs` object and the `render` function in a more persistent manner (see following).

## Standard get approach

This is a consistent way to use Fido that won't cause extra renders:

```jsx
const fetchConfigs = {
  fetchMyData: {
    path: "/api/getMyData"
  }
};

const render = fetches => {
  const { fetchMyData } = fetches;

  if (fetchMyData.inFlight) {
    return <div>Loading...</div>;
  }

  if (fetchMyData.success) {
    return <div>{fetchMyData.data}</div>;
  }

  return <div>No data</div>;
};

class MyComponent extends React.Component {
  render() {
    return (
      <Fido
        fetchConfigs={fetchConfigs}
        render={render}
      />
    );
  }
}
```

Note, to truly prevent re-renders, `MyComponent` must either extend `PureComponent`, or implement the `shouldComponentUpdate` life cycle method.

## Using another HTTP method (in this example, POST)

For things like data manipulation, you can use another HTTP method:

```jsx
import Fido, { HTTP_METHODS } from 'global/components/Fido';

const fetchConfigs = {
  createNewData: {
    path: "/api/createNewData",
    payload: {
      newData: 'I like data'
    },
    options: {
      method: HTTP_METHODS.post,
      // for methods like POST that manipulate data, you'll want to control when the request is sent, so turn off immediate fetch calling
      fetchImmediately: false
    }
  }
};

const render = fetches => {
  const { createNewData } = fetches;

  if (createNewData.inFlight) {
    return <div>Creating...</div>;
  }

  if (createNewData.success) {
    return <div>Data created successfully!</div>;
  }

  if (createNewData.fail) {
    return (
      <div>
        Data create failed :( error: {createNewData.error}
      </div>
    );
  }

  function createData() {
    createNewData.call();
  }

  return <div onClick={createData}>Click to create data!</div>;
};

class MyComponent extends React.Component {
  render() {
    return (
      <Fido
        fetchConfigs={fetchConfigs}
        render={render}
      />
    );
  }
}
```

### Overriding config on call

Additionally, you can pass override parameters to the call function.  It follows the same pattern as the fetchConfigs object.  This can be useful if your path or query parameters rely on data that isn't available ahead of time.  Ideally, though, updates would be made to the `fetchConfigs` prop of `Fido`.

```js
createNewData.call({
  path: '/api/createMyOtherData',
  query: {
    query: 'new'
  }
})
```

## Updating `fetchConfigs`

Fido supports updates to the `fetchConfigs` object:

```jsx
const render = onClick => fetches => {
  const { fetchMyData, fetchMyNewData } = fetches;

  if (fetchMyData.inFlight) {
    return <div>Loading...</div>;
  }

  if (fetchMyData.success) {
    return <div onClick={onClick}>{fetchMyData.data}</div>;
  }

  if (fetchMyNewData.inFlight) {
    return (
      <>
        <div>{fetchMyData.data}</div>
        <div>Loading new data...</div>
      </>
    );
  }

  if (fetchMyNewData.success) {
    return (
      <>
        <div>{fetchMyData.data}</div>
        <div>{fetchMyNewData.data}</div>
      </>
    );
  }

  return <div>No data</div>;
}

class MyComponent extends React.Component {
  state = {
    fetchConfigs: {
      fetchMyData: {
        path: "/api/getMyData"
      }
    }
  };

  addNewFetchConfig = () => {
    this.setState({
      fetchConfigs: {
        ...this.state.fetchConfigs,
        fetchMyNewData: {
          path: "/api/getMyOtherData"
        }
      }
    });
  };

  render() {
    return (
      <Fido
        fetchConfigs={this.state.fetchConfigs}
        render={render(this.addNewFetchConfig)}
      />
    );
  }
}
```

### Notes on updating `fetchConfigs`

- Removing any properties from `fetchConfigs` will not affect the state of any existing fetch items (except  `.call()` will throw an error)
- Adding a new property to `fetchConfigs` will immediately dispatch a fetch call if the `callOnMount` option is set
