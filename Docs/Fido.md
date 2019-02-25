# Fido usage examples

See Fido file for the fetch config object structure

## Quick and dirty

This is the easiest way to write a component that uses Fido:

```jsx
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
    )
  }
}
```

This pattern is fine for small/cheap renders, but be aware that Fido will re-render on every parent component update.  For more complicated or expensive renders, define the `fetchConfigs` object and the `render` function in a more persistent manner (see following).

## Standard approach

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

  return <div>No data</div>
}

class MyComponent extends React.Component {
  render() {
    return (
      <Fido
        fetchConfigs={fetchConfigs}
        render={render}
      />
    )
  }
}
```

Note, to truly prevent re-renders, `MyComponent` must either extend `PureComponent`, or implement the `shouldComponentUpdate` life cycle method.

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

  return <div>No data</div>
}

class MyComponent extends React.Component {
  state = {
    fetchConfigs: {
      fetchMyData: {
        path: "/api/getMyData"
      }
    }
  }

  addNewFetchConfig = () => {
    this.setState({
      fetchConfigs: {
        ...this.state.fetchConfigs,
        fetchMyNewData: {
          path: "/api/getMyOtherData"
        }
      }
    })
  }

  render() {
    return (
      <Fido
        fetchConfigs={this.state.fetchConfigs}
        render={render(this.addNewFetchConfig)}
      />
    )
  }
}
```

### Notes on updating `fetchConfigs`

- Removing any properties from `fetchConfigs` will not affect the state of any existing fetch items (except  `.call()` will throw an error)
- Adding a new property to `fetchConfigs` will immediately dispatch a fetch call if the `callOnMount` option is set