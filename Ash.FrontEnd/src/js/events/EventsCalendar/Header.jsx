import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

class Header extends React.PureComponent {
  state = {
    month: this.props.current,
  };
  previousMonth = month => () => {
    this.setState({ month: month.subtract(1, 'M') });
  };
  nextMonth = month => () => {
    this.setState({ month: month.add(1, 'M') });
  };
  render() {
    const { month } = this.state;
    return (
      <div className="header row flex-middle">
        <div>
          <FontAwesomeIcon
            className="column column-end"
            icon={faChevronLeft}
            onClick={this.previousMonth(month)}
          />
        </div>
        <div className="column column-center">
          <span>{month.format('MMMM YYYY')}</span>
        </div>
        <div>
          <FontAwesomeIcon
            className="column column-end"
            icon={faChevronRight}
            onClick={this.nextMonth(month)}
          />
        </div>
      </div>
    );
  }
}
export default Header;
