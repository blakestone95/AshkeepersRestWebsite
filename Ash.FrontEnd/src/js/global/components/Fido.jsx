import React from 'react';

/* EXAMPLE
fetchItems = {
  name: {
    // ...configObject
  },
  nextName,
  ...
}
*/

/**
 * Fetch configuration object default object shape
 * @prop {string} path - fetch url
 * @prop {Object} query - object containing query string key-value pairs
 * @prop {Object} payload - json payload for request
 * @prop {AbortController} abortSignal - for aborting the request
 * @prop {Object} options - other options [optional]
 * @prop {string} options.method - HTTP method type (case-insensitive) [optional]
 * @prop {boolean} options.callOnMount - flag for whether the fetch should be
 *    performed on mount [optional]
 * @prop {boolean} options.preservePreviousData - flag for whether the fetch should
 *    preserve the previously returned data set when a new call is initiated [optional]
 */
const defaultFetchConfig = {
  path: '',
  query: null,
  payload: null,
  abortSignal: null,
  options: {
    method: 'get',
    callOnMount: true,
    preservePreviousData: true,
  },
};

/**
 * Generate configurations for the supplied fetches
 * @param {Object} fetchItems - Object containing named config objects
 * @returns {Object} Fully initialized named config objects composed of
 *    the default config above, the supplied config object, and a new
 *    AbortController
 */
function createFetchConfigs(fetchItems) {
  return Object.entries(fetchItems).reduce((configs, [key, config]) => {
    const abortSignal = new AbortController();
    configs[key] = { ...defaultFetchConfig, ...config, abortSignal };

    return configs;
  }, {});
}

/**
 * Fetch state object default object shape
 * @prop {boolean} inFlight - is the request awaiting a reply?
 * @prop {boolean} success - did we receive a good reply from the server?
 * @prop {boolean} fail - did the request fail or did the server return a bad response?
 * @prop {Object} data - response payload of the successful request
 * @prop {Object} prevData - response payload of the previous successful request
 * @prop {Object} error - js error object
 * @prop {Function} call - function to initiate a fetch
 */
const initialFetchState = {
  inFlight: false,
  success: false,
  fail: false,
  data: null,
  prevData: null,
  error: null,
  call: null,
};

/**
 * Generate fetch state objects
 * @param {Object} fetchItems - Object containing named config objects
 * @param {Object} configs - generated fetch configuration objects
 * @param {Object} callFunc - "call" function
 * @returns {Object} Fetch config objects, keyed by config name, composed of
 *    the default state above and the "call" function
 */
function createInitFetchState(fetchItems, configs, callFunc) {
  return Object.keys(fetchItems).reduce((initState, key) => {
    initState[key] = {
      ...initialFetchState,
      call: callFunc(key, configs[key]),
    };

    return initState;
  }, {});
}

// TODO: add support for configuration updates
// TODO: implement request aborting
class Fido extends React.Component {
  constructor(props) {
    super(props);

    const { fetchItems } = props;
    const configs = createFetchConfigs(fetchItems);

    this.configs = configs;
    this.state = createInitFetchState(fetchItems, configs, this.onCall);
  }

  componentDidMount() {
    // Call any fetch items with the callOnMount option set
    Object.entries(this.configs).forEach(([key, config]) => {
      if (config.options.callOnMount) {
        this.dispatch(key, config);
      }
    });
  }

  onCall = (key, config) => configOverride => {
    let newConfig = config;
    if (configOverride) {
      newConfig = { ...config, ...configOverride };
    }
    this.dispatch(key, newConfig);
  };

  dispatch = (key, config) => {
    const method = config.options.method.toUpperCase();

    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      body = JSON.stringify(config.payload);
    }

    let headers = new Headers();
    if (body) headers.append('Content-Type', 'application/json');

    // TODO: implement query stringify for fetch url
    fetch(config.path, {
      method,
      headers,
      body,
      mode: 'same-origin', // only allow traffic to our back end
      credentials: 'same-origin',
      cache: 'no-store', // do not cache fetches made from this component
      redirect: 'follow', // default
      referrer: 'client', // default
      referrerPolicy: 'no-referrer-when-downgrade', // default
      // integrity
      // keepalive
      signal: config.abortSignal,
    })
      .then(Fido.processResponse)
      .then(this.setData(key))
      .catch(this.onFailure(key));

    // Update fetch state
    let prevData = null;
    if (config.options.preserveData) {
      prevData = this.state[key].data;
    }

    this.setState({
      [key]: {
        inFlight: true,
        success: false,
        fail: false,
        data: null,
        prevData,
        error: null,
      },
    });
  };

  static processResponse(response) {
    if (!response.ok) throw new Error('No success. Such bad response.');

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    throw new TypeError('Response not JSON. Very annoy.');
  }

  setData = key => json => {
    this.setState({
      [key]: {
        inFlight: false,
        success: true,
        fail: false,
        data: json,
        prevData: null,
        error: null,
      },
    });
  };

  onFailure = key => error => {
    this.setState({
      [key]: {
        inFlight: false,
        success: false,
        fail: true,
        data: null,
        prevData: null,
        error: error,
      },
    });

    throw new Error('No success. Cannot fetch. So Network error.');
  };

  render() {
    const { render } = this.props;
    const { ...fetches } = this.state;

    return render(fetches);
  }
}

export default Fido;
