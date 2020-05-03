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
        inFlight: true,
        success: false,
        fail: false,
        data: payload.preserveData ? state.data : null,
        error: null,
      };
    case ACTIONS.setData:
      return {
        ...state,
        inFlight: false,
        success: true,
        fail: false,
        data: payload.json,
        error: null,
      };
    case ACTIONS.fetchFailed:
      return {
        ...state,
        inFlight: false,
        success: false,
        fail: true,
        data: null,
        error: payload.error,
      };
    default:
      return state;
  }
}

/**
 * Hook wrapper for calling `fetch`.  Manages fetch's state, providing an easy
 * way to react to changes in the fetch's status, without having to write all
 * the boilerplate every time.
 * @param {FetchConfig} config - fetch configuration objects
 * @returns {FetchState, function} - fetch state object and "call" function
 *   to manually initiate a fetch
 */
export default function useFido(config) {
  // Compose passed-in configuration with the default config object
  const fetchConfig = useMemo(() => ({ ...defaultFetchConfig, ...config }), [
    config,
  ]);

  // Create fetch state
  const [fetchState, dispatch] = useReducer(
    fetchStateReducer,
    initialFetchState
  );

  /**
   * Holds the abort controller responsible for managing
   * the abort signal of the fetch while in flight
   * @type {AbortController}
   */
  const abortController = useRef();

  // Create fetch call methods
  const callFetch = useMemo(
    () => createCall(fetchConfig, abortController, dispatch),
    [fetchConfig]
  );

  // Automatically call the fetch if fetchImmediately is set
  useEffect(() => {
    const firstRequest = !(
      fetchState.inFlight ||
      fetchState.success ||
      fetchState.fail
    );
    if (firstRequest && fetchConfig.options.fetchImmediately) {
      callFetch();
    }
  }, [fetchState, fetchConfig, callFetch]);

  // Return fetch state and call functions
  return [fetchState, callFetch];
}

/**
 * Create the call function that initiates a fetch call
 * @param {FetchConfig} config - fetch configuration associated with the name
 * @param {object} abortControllerRef - React ref
 * @param {AbortController} [abortControllerRef.current] - abort controller of a previous request
 * @param {Function} dispatch - dispatch function provided by the useReducer hook that manages the fetch state
 * @returns {Function} - function to initiate a fetch call
 */
function createCall(config, abortControllerRef, dispatch) {
  return function call() {
    const method = config.options.method.toUpperCase();
    const newAbortController = new AbortController();

    let body = null;
    if (![HTTP_METHODS.get, HTTP_METHODS.head].includes(method)) {
      body = JSON.stringify(config.payload);
    }

    let headers = new Headers();
    if (body) headers.append('Content-Type', 'application/json');

    // Abort previous fetch if there is any
    if (abortControllerRef.current) abortControllerRef.current.abort();
    // Replace previously aborted (or new) AbortController
    abortControllerRef.current = newAbortController;

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
      signal: newAbortController.signal,
      // override any of these options with user-provided overrides
      ...config.fetchOptions,
    };

    // TODO: Add all fetch options to config so they can be overwritten but users
    fetch(fetchUrl, fetchOptions)
      // Process fetch response
      .then((response) => {
        if (!response.ok) throw new Error('No success. Such bad response.');

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }

        throw new TypeError('Response not JSON. Very annoy.');
      })

      // Save returned data on success
      .then((json) => {
        dispatch({ type: ACTIONS.setData, payload: { json } });
      })

      // Save error data on failure
      .catch((error) => {
        // Ignore aborted fetches (don't change state)
        if (error.name === 'AbortError') {
          return;
        }

        dispatch({ type: ACTIONS.setData, payload: { error } });
        // Rethrow so that error isn't silently swallowed
        throw new Error('No success. Cannot fetch. So Network error.');
      })

      // Always clear the abort controller when done processing the fetch
      .finally(() => {
        delete abortControllerRef.current;
      });

    // Immediately update fetch state to indicate request is in flight
    dispatch({
      type: ACTIONS.initiateFetch,
      payload: { preserveData: config.options.preserveData },
    });
  };
}
