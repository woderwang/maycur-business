import React, { Component } from 'react';
import styles from './DateFilter.less';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import _ from 'lodash'; // import moment from 'moment';

class DateFilter extends Component {
  constructor(props) {
    super(props);

    this.dateChange = nextValue => {
      const setSelectedKeys = this.props.setSelectedKeys;
      this.setState({
        selectedValue: nextValue
      }, () => {
        setSelectedKeys(nextValue);
      });
    };

    this.state = {
      selectedValue: props.selectedKeys || []
    };
  }

  componentDidUpdate(prevProps) {
    const prevSelectedKeys = prevProps.selectedKeys;
    const selectedKeys = this.props.selectedKeys;
    const selectedValue = this.state.selectedValue;

    if (!_.isEqual(prevSelectedKeys, selectedKeys) && !_.isEmpty(selectedValue, selectedKeys)) {
      this.setState({
        selectedValue: selectedKeys
      });
    }
  }

  render() {
    const confirm = this.props.confirm;
    const selectedValue = this.state.selectedValue;
    return React.createElement("div", {
      className: styles['pin']
    }, React.createElement(RangeCalendar, {
      locale: zhCN,
      selectedValue: selectedValue,
      dateInputPlaceholder: ['开始', '结束'],
      showToday: true,
      onChange: data => {
        this.dateChange(data);
      },
      showOk: true,
      onOk: () => {
        confirm();
      }
    }));
  }

}

export default DateFilter;