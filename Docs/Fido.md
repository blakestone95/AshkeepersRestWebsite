# Fido - React wrapper for `fetch`

Fido is a React component for making browser HTTP requests with the JavaScript `fetch` API.  It aims to provide an easy and reliable way to handle server calls in a React environment.  Fido follows the render props pattern to give developers full control over what it renders.

# The component

## Fido

To use Fido in your project, simply import it:

```jsx
import Fido from 'global/components/Fido';
```

And then use it as a React component with the props shown below:

```jsx
<Fido 
  fetchConfigs={fetchConfigs} 
  render={renderFunction} 
/>
```

Fido also exports the HTTP_METHODS enumeration:

```jsx
import Fido, { HTTP_METHODS } from 'global/components/Fido';

HTTP_METHODS = {
  get: 'GET',
  head: 'HEAD',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  connect: 'CONNECT',
  options: 'OPTIONS',
  trace: 'TRACE',
  patch: 'PATCH',
};
```

## `fetchConfigs`

`fetchConfigs` is a collection of objects (read, object of objects) that specifies how Fido should perform the `fetch`.  Below is listed each configuration property with some notes about each one:

```js
fetchConfig = {
  // Property name here will be the same property name used in Fido's output
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

## `render`

`render` is a function used to define what Fido renders.  It passes down the state of each fetch in the form of a collection of objects.  Each fetch state passed down has the same property name as the config used to create it.  It must return a valid React component return value.

```jsx
render={fetches => {
  const fetchStateObj = fetches.fetchConfigName;
  return <MyDataView data={fetchStateObj.data} />
}}
```

Following is the structure of a fetch state object:

```js
fetches = {
  // Fetch config name
  fetchMyData: {
    // flag - has the request been sent and no reply received
    inFlight: false,

    // flag - has a good response been received (no 400 or 500 errors)
    success: false,

    // flag - has the request failed or an error response was received (400 or 500 errors)
    fail: false,

    // The JSON body of the reply
    data: null,

    // The thrown JavaScript error object if an error occurs
    error: null,

    // A function to dispatch a fetch request
    // Accepts a config override object that follows the same structure as a fetchConfigs property
    call: callFunc(configOverride)
  }
}
```

# Fido usage examples

## Quick and dirty GET request

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

## Standard GET request approach

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

Note, to truly prevent re-renders of Fido, `MyComponent` must either extend `PureComponent`, or implement the `shouldComponentUpdate` life cycle method, as Fido is a regular component and will update whenever its parent updates.

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
