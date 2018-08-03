import React from 'react';
import moment from 'moment';

class Header extends React.PureComponent {
  state = {
    month: this.props.current,
    date: this.props.selected
  }
  
  nextMonth = (month) => {
    this.setState({ month:this.state.month.add(1, 'M') })
  }

  previousMonth = () => {
    this.setState({ month:this.state.month.subtract(1, 'M') })
  }

  onDateClick = (selected) => {
    this.setState({ date:selected })
  }
  
  render() {
    return(
      <div>
        <div onClick={this.previousMonth()}>Previous</div>
        <span>{this.state.month.format('MMMM YYYY')}</span>
        <div onClick={this.nextMonth()}>Next</div>
      </div>
    )
  }
}

export default Header;
