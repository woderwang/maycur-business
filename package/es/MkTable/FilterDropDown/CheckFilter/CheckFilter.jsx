import "maycur-antd/lib/radio/style/css";
import _Radio from "maycur-antd/lib/radio";
import "maycur-antd/lib/checkbox/style/css";
import _Checkbox from "maycur-antd/lib/checkbox";
import "maycur-antd/lib/input/style/css";
import _Input from "maycur-antd/lib/input";

/*
 * @Author: yuxuan
 * @Date: 2018-11-13 11:20:30
 * @LastEditors: RongWei
 * @LastEditTime: 2019-01-10 11:27:08
 * @Description: 筛选表头单选和多选的 Dropdown
 */
import React, { Component } from 'react';
import _ from 'lodash';
import utils from '../../../utils/utils';
const prefix = utils.prefixCls;
const Search = _Input.Search;

class CheckFilter extends Component {
  constructor(props) {
    super(props);

    this.onChange = value => {
      const setSelectedKeys = this.props.setSelectedKeys;
      setSelectedKeys(value);
    };

    this.onSearch = value => {
      const filters = this.props.filters;
      let filtered;

      if (value) {
        filtered = _.filter(filters, function (o) {
          return _.includes(o.text, value);
        });
      } else {
        filtered = filters;
      }

      this.setState({
        filters: filtered
      });
    };

    this.onChangeSearchKey = e => {
      this.setState({
        searchKey: e.target.value
      });
    };

    this.selectAll = e => {
      const setSelectedKeys = this.props.setSelectedKeys;
      let filters = this.state.filters;

      if (e.target.checked) {
        let all = _.map(filters, 'value');

        setSelectedKeys(all);
      } else {
        setSelectedKeys([]);
      }
    };

    this.onConfirm = () => {
      const confirm = this.props.confirm;
      confirm();
    };

    this.reset = () => {
      const setSelectedKeys = this.props.setSelectedKeys;
      setSelectedKeys([]);
      this.setState({
        searchKey: null
      }, () => {
        this.onSearch(this.state.searchKey);
      });
    };

    this.state = {
      filters: props.filters,
      searchKey: null
    };
  }

  componentDidUpdate(preProps) {
    if (preProps.filters.length !== this.props.filters.length) {
      this.setState({
        filters: this.props.filters
      });
    }
  }

  render() {
    const _this$props = this.props,
          placeholder = _this$props.placeholder,
          selectedKeys = _this$props.selectedKeys,
          filterMultiple = _this$props.filterMultiple;
    let _this$state = this.state,
        filters = _this$state.filters,
        searchKey = _this$state.searchKey;
    return React.createElement("div", {
      className: `${prefix}-check-filter`
    }, React.createElement("div", {
      className: 'pin-search'
    }, React.createElement(Search, {
      value: searchKey,
      onSearch: this.onSearch,
      onChange: this.onChangeSearchKey,
      placeholder: placeholder
    })), filterMultiple ? React.createElement("div", {
      className: `${prefix}-check-filter_pin-box`
    }, React.createElement(_Checkbox.Group, {
      onChange: this.onChange,
      value: selectedKeys
    }, filters && filters.length > 0 ? filters.map((item, index) => React.createElement(_Checkbox, {
      value: item.value,
      className: 'pin-item',
      key: index
    }, item.text)) : null)) : React.createElement("div", {
      className: 'pin-radio-box'
    }, React.createElement(_Radio.Group, {
      onChange: e => this.onChange(e.target.value),
      value: selectedKeys
    }, filters && filters.length > 0 ? filters.map((item, index) => React.createElement(_Radio, {
      className: 'pin-item',
      value: item.value,
      key: index
    }, item.text)) : null)), React.createElement("div", {
      className: 'pin-footer'
    }, React.createElement("div", {
      onClick: this.onConfirm,
      className: 'footer-item'
    }, "\u786E\u5B9A"), React.createElement("div", {
      onClick: this.reset,
      className: 'footer-item'
    }, "\u91CD\u7F6E")));
  }

}

CheckFilter.defaultProps = {
  filters: [],
  filterMultiple: false
};
export default CheckFilter;