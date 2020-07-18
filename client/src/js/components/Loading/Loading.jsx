import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * @typedef LoadingProps
 * @prop {boolean} [isLoading] - Are we waiting on data for the children?
 * @prop {ReactElement} [children] - Stuff we are waiting on data for
 */

/**
 * Simple loading spinner
 * @param {LoadingProps} props
 */
function Loading(props) {
  const { isLoading = true, children } = props;

  if (!isLoading) return children;

  return (
    <div className="ash-loading">
      <FontAwesomeIcon icon={faSpinner} spin />
      Loading...
    </div>
  );
}

export default Loading;
