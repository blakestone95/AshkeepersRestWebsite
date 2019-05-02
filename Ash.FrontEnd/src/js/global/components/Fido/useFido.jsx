import { useEffect, useReducer, useMemo, useCallback, useRef } from 'react';

import { HTTP_METHODS } from './constants';

/**
 * Fetch configuration object default object shape
 * @prop {string} path - fetch url
 * @prop {object} query - object containing query string key-value pairs
 * @prop {object} payload - json payload for request
 * @prop {object} options - other options [optional]
 * @prop {string} options.method - HTTP method type (case-insensitive) [optional]
 * @prop {boolean} options.fetchImmediately - flag for whether the fetch should be
 *    performed right away (on mount or on update which adds a new fetch config) [optional]
 * @prop {boolean} options.preservePreviousData - flag for whether the fetch should
 *    preserve the previously returned data set when a new call is initiated [optional]
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
};

const ACTIONS = {
  initiateFetch: 'initiateFetch',
  setData: 'setData',
  fetchFailed: 'fetchFailed',
};

function fetchStateReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.initiateFetch:
      return {
        inFlight: true,
        success: false,
        fail: false,
        data: payload.preserveData ? state.data : null,
        error: null,
      };
    case ACTIONS.setData:
      return {
        inFlight: false,
        success: true,
        fail: false,
        data: payload.json,
        error: null,
      };
    case ACTIONS.fetchFailed:
      return {
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
 * Fetch state object default object shape
 * @prop {boolean} inFlight - is the request awaiting a reply?
 * @prop {boolean} success - did we receive a good reply from the server?
 * @prop {boolean} fail - did the request fail or did the server return a bad response?
 * @prop {object} data - response payload of the successful request
 * @prop {object} error - js error object
 */
const initialFetchState = {
  inFlight: false,
  success: false,
  fail: false,
  data: null,
  error: null,
};

/**
 * Hook wrapper for calling `fetch`
 *
 * @param {object} config - fetch configuration object
 * @returns {object} - fetch state object props and "call" function
 *    to explicitly initiate a fetch
 */
export default function useFido(config) {
  // Compose the passed-in configuration with the default config object
  const fetchConfig = useMemo(() => ({ ...defaultFetchConfig, ...config }), [
    config,
  ]);

  // Create fetch state
  const [fetchState, dispatch] = useReducer(
    fetchStateReducer,
    initialFetchState
  );

  // Store abort controller ref
  const abortRef = useRef(null);

  // Create call function that dispatches the fetch call
  const call = useCallback(() => {
    const method = fetchConfig.options.method.toUpperCase();
    const abortController = new AbortController();

    let body = null;
    if (![HTTP_METHODS.get, HTTP_METHODS.head].includes(method)) {
      body = JSON.stringify(fetchConfig.payload);
    }

    let headers = new Headers();
    if (body) headers.append('Content-Type', 'application/json');

    // Abort previous fetch if there is any
    if (abortRef.current) abortRef.current.abort();
    // Replace previously aborted (or new) AbortController
    abortRef.current = abortController;

    let fetchUrl = fetchConfig.path;
    if (fetchConfig.query) {
      const stringifiedQueryParams = Object.entries(fetchConfig.query)
        .map(([key, param]) => `${key}=${param}`)
        .join('&');
      fetchUrl += `?${stringifiedQueryParams}`;
    }

    // TODO: Add all fetch options to config so they can be overwritten but users
    fetch(fetchUrl, {
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
        dispatch({ type: ACTIONS.setData, payload: { json } });
      })

      // Save error data on failure
      .catch(error => {
        // Ignore aborted fetches (don't change state)
        if (error.name === 'AbortError') {
          return;
        }

        dispatch({ type: ACTIONS.setData, payload: { error } });
        // Rethrow so that error isn't silently swallowed
        throw new Error('No success. Cannot fetch. So Network error.');
      });

    // Immediately update fetch state to indicate request is in flight
    dispatch({
      type: ACTIONS.initiateFetch,
      payload: { preserveData: fetchConfig.options.preserveData },
    });
  }, [fetchConfig]);

  // Set up automatic fetch calling if option is set
  useEffect(() => {
    const firstRequest = !(
      fetchState.inFlight ||
      fetchState.success ||
      fetchState.fail
    );
    if (firstRequest && fetchConfig.options.fetchImmediately) {
      call();
    }
  }, [call, fetchState, fetchConfig]);

  return { ...fetchState, call };
}
