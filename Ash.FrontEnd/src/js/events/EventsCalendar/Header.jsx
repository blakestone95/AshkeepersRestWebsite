import React from 'react';
import moment from 'moment';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

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
          <ChevronLeftIcon
            className="column column-end"
            onClick={this.previousMonth(month)}
          />
        </div>
        <div className="column column-center">
          <span>{month.format('MMMM YYYY')}</span>
        </div>
        <div>
          <ChevronRightIcon
            className="column column-end"
            onClick={this.nextMonth(month)}
          />
        </div>
      </div>
    );
  }
}
export default Header;
