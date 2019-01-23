import React, { Component } from 'react';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import _ from 'lodash';
import moment from 'moment';
import utils from '../../../utils/utils';
const prefix = utils.prefixCls;

class DateFilter extends Component {
  constructor(props) {
    super(props);

    this.dateChange = nextValue => {
      const _this$props = this.props,
            confirm = _this$props.confirm,
            setSelectedKeys = _this$props.setSelectedKeys;
      nextValue[0] = moment(nextValue[0]).startOf('day');
      nextValue[1] = moment(nextValue[1]).endOf('day');
      this.setState({
        selectedValue: nextValue
      }, () => {
        setSelectedKeys(nextValue);

        if (nextValue.length > 1) {
          confirm();
        }
      });
    };

    this.onChoose = value => {
      let now = new Date();
      const _this$props2 = this.props,
            confirm = _this$props2.confirm,
            setSelectedKeys = _this$props2.setSelectedKeys;
      this.setState({
        range: value
      }, () => {
        switch (value) {
          case 'recentThree':
            this.setState({
              selectedValue: [moment(now).subtract(3, 'months'), moment()]
            }, () => {
              setSelectedKeys(this.state.selectedValue);
              confirm();
            });
            break;

          case 'recentOne':
            this.setState({
              selectedValue: [moment(now).subtract(1, 'months'), moment()]
            }, () => {
              setSelectedKeys(this.state.selectedValue);
              confirm();
            });
            break;

          case 'all':
            this.setState({
              selectedValue: []
            }, () => {
              setSelectedKeys(this.state.selectedValue);
              confirm();
            });
            break;

          case 'customize':
            this.setState({
              selectedValue: []
            });
            break;

          default:
            break;
        }
      });
    };

    this.state = {
      selectedValue: props.selectedKeys || [],
      rangeOptions: [{
        value: 'all',
        label: '全部'
      }, {
        value: 'recentOne',
        label: '最近一个月'
      }, {
        value: 'recentThree',
        label: '最近三个月'
      }],
      range: 'all'
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
    const isNeedSideBar = this.props.isNeedSideBar;
    const _this$state = this.state,
          selectedValue = _this$state.selectedValue,
          range = _this$state.range,
          rangeOptions = _this$state.rangeOptions;
    return React.createElement("div", {
      className: `${prefix}-date-filter`
    }, React.createElement(RangeCalendar, {
      renderFooter: () => {
        if (isNeedSideBar) {
          return React.createElement("div", {
            className: "tabs"
          }, rangeOptions.map((item, index) => React.createElement("div", {
            className: 'tab' + (range === item.value ? ' active' : ''),
            onClick: this.onChoose.bind(this, item.value),
            key: index
          }, item.label)));
        } else {
          return null;
        }
      },
      locale: zhCN,
      selectedValue: selectedValue,
      dateInputPlaceholder: ['开始', '结束'],
      showToday: false,
      onChange: data => {
        this.dateChange(data);
      },
      showOk: false
    }));
  }

}

DateFilter.defaultProps = {
  isNeedSideBar: false
};
export default DateFilter;