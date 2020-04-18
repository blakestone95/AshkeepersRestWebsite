import { useEffect, useReducer, useMemo, useRef } from 'react';

import { HTTP_METHODS } from './constants';

/**
 * Fetch configuration object default object shape
 * @typedef {Object} FetchConfig
 * @prop {string} path - fetch url
 * @prop {Object} [query] - object containing query string key-value pairs
 * @prop {Object} [payload] - json payload for request
 * @prop {Object} [options] - other options
 * @prop {string} [options.method='GET'] - HTTP method type (case-insensitive)
 * @prop {boolean} [options.fetchImmediately=true] - flag for whether the fetch should be
 *    performed right away (on mount or on update which adds a new fetch config)
 * @prop {boolean} [options.preservePreviousData=true] - flag for whether the fetch should
 *    preserve the previously returned data set when a new call is initiated
 * @prop {Object} [fetchOptions] - directly set the fetch options
 */
const defaultFetchConfig = {
  path: '',
  query: null,
  payload: null,
  options: {
    method: HTTP_METHODS.get,
    fetchImmediately: true,
    preservePreviousData: true,
  },
  fetchOptions: null,
};

/**
 * Fetch state object default object shape
 * @typedef {Object} FetchState
 * @prop {boolean} inFlight - is the request awaiting a reply?
 * @prop {boolean} success - did we receive a good reply from the server?
 * @prop {boolean} fail - did the request fail or did the server return a bad response?
 * @prop {Object} data - response payload of the successful request
 * @prop {Object} error - js error object if fetch fails for some reason
 */
const initialFetchState = {
  inFlight: false,
  success: false,
  fail: false,
  data: null,
  error: null,
};

/**
 * Action types for useFido's reducer state
 * @private
 * @enum {string}
 */
const ACTIONS = {
  initiateFetch: 'initiateFetch',
  setData: 'setData',
  fetchFailed: 'fetchFailed',
  createNew: 'createNew',
  deleteOld: 'deleteOld',
};

/**
 * Reducer for managing useFido's internal state
 * @private
 * @param {Object<string, FetchState>} state - previous state
 * @param {Object} action - action definition
 * @param {string} action.name - config name; each fetch config must be named
 *    so it can be referred to properly in state
 * @returns {Object<string, FetchState>} - new state
 */
function fetchStateReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.initiateFetch:
      return {
        ...state,
        [payload.name]: {
          inFlight: true,
          success: false,
          fail: false,
          data: payload.preserveData ? state.data : null,
          error: null,
        },
      };
    case ACTIONS.setData:
      return {
        ...state,
        [payload.name]: {
          inFlight: false,
          success: true,
          fail: false,
          data: payload.json,
          error: null,
        },
      };
    case ACTIONS.fetchFailed:
      return {
        ...state,
        [payload.name]: {
          inFlight: false,
          success: false,
          fail: true,
          data: null,
          error: payload.error,
        },
      };
    case ACTIONS.createNew:
      return {
        ...state,
        [payload.name]: { ...initialFetchState },
      };
    case ACTIONS.deleteOld: {
      const newState = { ...state };
      delete newState[payload.name];
      return newState;
    }
    default:
      return state;
  }
}

/**
 * Wrapper around the fetch state initializer function to provide it the user-defined config object
 * @private
 * @param {Object<string, FetchConfig>} config - fetch configuration objects
 * @returns {Function} - fetch state initializer function
 */
function initializeFetchState(config) {
  /**
   * Initializer function for the fetch state to copy the default fetch configuration for each given config
   * @private
   * @param {FetchConfig} defaultState - default fetch configuration object
   * @returns {FetchConfig} - fetch config object with the default values filled in
   */
  return function(defaultState) {
    return Object.keys(config).reduce((initState, name) => {
      initState[name] = { ...defaultState };
      return initState;
    }, {});
  };
}

/**
 * Hook wrapper for calling `fetch`
 * @param {Object<string, FetchConfig>} config - fetch configuration objects
 * @returns {Object<string, FetchState>} - collection of fetch state objects
 *    and "call" function to explicitly initiate a fetch
 */
export default function useFido(config) {
  // Compose each passed-in configuration with the default config object and add the call method
  const fetchConfigs = useMemo(() => {
    return Object.keys(config).reduce((newConfig, name) => {
      newConfig[name] = { ...defaultFetchConfig, ...config[name] };
      return newConfig;
    }, {});
  }, [config]);

  // Create fetch state
  const [fetchState, dispatch] = useReducer(
    fetchStateReducer,
    initialFetchState,
    initializeFetchState(config)
  );

  // Create fetch call methods
  const fetchCalls = useMemo(() => {
    return Object.keys(fetchConfigs).reduce((fetchCalls, name) => {
      fetchCalls[name] = createCall(name, fetchConfigs[name], dispatch);
      return fetchCalls;
    }, {});
  }, [fetchConfigs]);

  // Handle fetchState synchronization
  // Probably not strictly necessary, but it's nice to handle it gracefully nonetheless
  // Store fetch state in a ref because we only care when config changes since state is derived from config
  const latestFetchState = useRef(fetchState);
  useEffect(() => {
    latestFetchState.current = fetchState;
  }, [fetchState]);
  // Update state if the shape of the config object is different
  useEffect(() => {
    // Initialize the state of any new names in the config
    const configNames = Object.keys(fetchConfigs);
    const latestState = latestFetchState.current;
    const newNames = configNames.filter(
      name => !(latestState[name] instanceof Object)
    );
    newNames.forEach(name => {
      dispatch({ type: ACTIONS.createNew, payload: { name } });
    });

    // Clean up any old state objects who's names are not in the new config
    const stateNames = Object.keys(latestFetchState.current);
    const oldNames = stateNames.filter(
      name => !(fetchConfigs[name] instanceof Object)
    );
    oldNames.forEach(name => {
      dispatch({ type: ACTIONS.deleteOld, payload: { name } });
    });
  }, [fetchConfigs]);

  // Set up automatic fetch calling if option is set
  useEffect(() => {
    Object.keys(fetchState).forEach(name => {
      const state = fetchState[name];
      const config = fetchConfigs[name];

      const firstRequest = !(state.inFlight || state.success || state.fail);
      if (firstRequest && config.options.fetchImmediately) {
        const call = fetchCalls[name];
        call();
      }
    });
  }, [fetchState, fetchConfigs, fetchCalls]);

  // Compose fetch state and call functions before returning
  return Object.keys(config).reduce((composed, name) => {
    composed[name] = { ...fetchState[name], call: fetchCalls[name] };
    return composed;
  }, {});
}

/**
 * Collection of named abort controllers to manage the abort signal of each active fetch
 * @type {Object<string, AbortController>}
 */
const abortControllers = {};

/**
 * Create the call function that initiates a fetch call
 * @param {string} name - configuration name
 * @param {FetchConfig} config - fetch configuration associated with the name
 * @param {Function} dispatch - dispatch function provided by the useReducer hook that manages the fetch state
 * @returns {Function} - function to initiate a fetch call
 */
// Create call function that dispatches the fetch call
function createCall(name, config, dispatch) {
  return function() {
    const method = config.options.method.toUpperCase();
    const abortController = new AbortController();

    let body = null;
    if (![HTTP_METHODS.get, HTTP_METHODS.head].includes(method)) {
      body = JSON.stringify(config.payload);
    }

    let headers = new Headers();
    if (body) headers.append('Content-Type', 'application/json');

    // Abort previous fetch if there is any
    if (abortControllers[name]) abortControllers[name].abort();
    // Replace previously aborted (or new) AbortController
    abortControllers[name] = abortController;

    let fetchUrl = config.path;
    if (config.query) {
      const stringifiedQueryParams = Object.entries(config.query)
        .map(([key, param]) => `${key}=${param}`)
        .join('&');
      fetchUrl += `?${stringifiedQueryParams}`;
    }

    const fetchOptions = {
      method,
      headers,
      body,
      // only allow traffic to our back end
      mode: 'same-origin',
      credentials: 'same-origin',
      // do not cache fetches made from this component
      cache: 'no-store',
      // typical defaults, but ensure same options are set across browsers
      redirect: 'follow',
      referrer: 'client',
      referrerPolicy: 'no-referrer-when-downgrade',
      // include experimental abort controller signal
      signal: abortController.signal,
      // override any of these options with user-provided overrides
      ...config.fetchOptions,
    };

    // TODO: Add all fetch options to config so they can be overwritten but users
    fetch(fetchUrl, fetchOptions)
      // Process fetch response
      .then(response => {
        if (!response.ok) throw new Error('No success. Such bad response.');

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }

        throw new TypeError('Response not JSON. Very annoy.');
      })

      // Save returned data on success
      .then(json => {
        dispatch({ type: ACTIONS.setData, payload: { name, json } });
      })

      // Save error data on failure
      .catch(error => {
        // Ignore aborted fetches (don't change state)
        if (error.name === 'AbortError') {
          return;
        }

        dispatch({ type: ACTIONS.setData, payload: { name, error } });
        // Rethrow so that error isn't silently swallowed
        throw new Error('No success. Cannot fetch. So Network error.');
      })

      // Always clear the abort controller when done processing the fetch
      .finally(() => {
        delete abortControllers[name];
      });

    // Immediately update fetch state to indicate request is in flight
    dispatch({
      type: ACTIONS.initiateFetch,
      payload: { name, preserveData: config.options.preserveData },
    });
  };
}
