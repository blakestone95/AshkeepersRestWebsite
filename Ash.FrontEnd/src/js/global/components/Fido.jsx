import React from 'react';
import { memoize } from 'memoize-one';

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
 * @prop {object} query - object containing query string key-value pairs
 * @prop {object} payload - json payload for request
 * @prop {AbortController} abortSignal - for aborting the request
 * @prop {object} options - other options [optional]
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
 * Fetch state object default object shape
 * @prop {boolean} inFlight - is the request awaiting a reply?
 * @prop {boolean} success - did we receive a good reply from the server?
 * @prop {boolean} fail - did the request fail or did the server return a bad response?
 * @prop {object} data - response payload of the successful request
 * @prop {object} prevData - response payload of the previous successful request
 * @prop {object} error - js error object
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
 * @param {object} fetchItems - Object containing named config objects
 * @param {object} callFunc - "call" function
 * @returns {object} Fetch config objects, keyed by config name, composed of
 *    the default state above and the "call" function
 */
function createInitFetchState(fetchItems, callFunc) {
  return Object.keys(fetchItems).reduce((initState, key) => {
    initState[key] = {
      ...initialFetchState,
      call: callFunc(key),
    };

    return initState;
  }, {});
}

/**
 * Fetch React Component for retrieving data from a server using the *fetch* API
 * Follows the render props pattern for wrapping children
 * @prop {object} fetchItems - Collection of configurations for fetch calls.
 *    Will generate new state for any new fetch items received, but will not discard any
 *    previous fetch item states until being unmounted.
 */
class Fido extends React.Component {
  constructor(props) {
    super(props);

    const { fetchItems } = props;
    this.state = createInitFetchState(fetchItems, this.onCall);
    this.aborts = {};
  }

  componentDidMount() {
    const configs = this.getConfigs();

    // Call any fetch items with the callOnMount option set
    Object.entries(configs).forEach(([key, config]) => {
      if (config.options.callOnMount) {
        this.dispatch(key, config);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { fetchItems } = this.props;

    if (fetchItems !== prevProps.fetchItems) {
      // Generate default state for any new fetch items (don't mess with existing ones)
      const newFetchItems = Object.keys(fetchItems).reduce(
        (newFetchItems, itemKey) => {
          if (!prevProps.fetchItems[itemKey]) {
            newFetchItems[itemKey] = fetchItems[itemKey];
          }

          return newFetchItems;
        },
        {}
      );
      this.setState({ ...createInitFetchState(newFetchItems, this.onCall) });
    }
  }

  /**
   * Get the configurations derived from fetchItems
   * Small wrapper for *generateConfigs*
   */
  getConfigs = () => {
    const { fetchItems } = this.props;

    return this.generateConfigs(fetchItems);
  };

  /**
   * Generate configurations for the supplied fetches
   * **Memoized** so that configs are only regenerated if fetchItems changes
   * @param {object} fetchItems - Object containing named config objects
   * @returns {object} Named config objects composed of the default config
   *    and the supplied config object
   */
  generateConfigs = memoize(fetchItems =>
    Object.entries(fetchItems).reduce((configs, [key, config]) => {
      configs[key] = { ...defaultFetchConfig, ...config };

      return configs;
    }, {})
  );

  /**
   * Call method for initiating a fetch
   * @param {string} key - fetch item key
   * @returns {(configOverride: object) => void} accepts immediate overrides to the
   *    config object and calls the dispatch method
   */
  onCall = key => configOverride => {
    const configs = this.getConfigs();

    let newConfig = configs[key];
    if (configOverride) {
      newConfig = { ...config, ...configOverride };
    }

    this.dispatch(key, newConfig);
  };

  /**
   * Initiate a fetch with a given configuration
   * @param {string} key - fetch item key
   * @param {object} config - fetch item configuration
   */
  dispatch = (key, config) => {
    const method = config.options.method.toUpperCase();
    const abortController = new AbortController();

    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      body = JSON.stringify(config.payload);
    }

    let headers = new Headers();
    if (body) headers.append('Content-Type', 'application/json');

    // Abort previous fetch if there is any
    if (this.aborts[key]) this.aborts[key].abort();
    // Replace previously aborted (or new) AbortController
    this.aborts[key] = abortController;

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
      signal: abortController.signal,
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

  /**
   * Preprocess fetch response
   * @param {object} response - fetch response
   */
  static processResponse(response) {
    if (!response.ok) throw new Error('No success. Such bad response.');

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    throw new TypeError('Response not JSON. Very annoy.');
  }

  /**
   * Handle successful fetch
   * @param {string} key - fetch item key
   * @returns {(json: object) => void}
   */
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

  /**
   * Handle fetch failure
   * @param {string} key - fetch item key
   * @returns {(error: object) => void}
   */
  onFailure = key => error => {
    // Ignore aborted fetches (don't change state)
    if (error instanceof AbortError) {
      return;
    }

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
    const fetches = { ...this.state };
    return render(fetches);
  }
}

export default Fido;
