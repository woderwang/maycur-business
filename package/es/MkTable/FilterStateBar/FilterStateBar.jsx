import "maycur-antd/lib/button/style/css";
import _Button from "maycur-antd/lib/button";
import "core-js/modules/web.dom.iterable";
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import utils from '../../utils/utils';
const prefix = utils.prefixCls;

class FilterStateBar extends Component {
  constructor(props) {
    super(props);

    this.limitLen = function (str) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
      let result = '';

      if (_.isString(str)) {
        if (str.length > len) {
          result = str.substr(0, len) + '...';
        } else {
          result = str;
        }
      } else {
        result = str;
      }

      return result;
    };

    this.clear = allFilters => {
      const removeFilter = this.props.removeFilter;
      let filterKeys = [];

      _.forEach(allFilters, filter => {
        filterKeys.push(filter.key);
      });

      if (typeof removeFilter === 'function') removeFilter(filterKeys);
    };

    this.state = {};
    this.remove = this.remove.bind(this);
    this.convertFilter = this.convertFilter.bind(this);
  }

  remove(filter) {
    const removeFilter = this.props.removeFilter;
    if (typeof removeFilter === 'function') removeFilter(filter.key);
  }

  convertFilter(filters) {
    const columns = this.props.columns;
    let newFilters = [];

    _.forEach(filters, (filterValue, key) => {
      let filterColumn = _.find(columns, {
        dataIndex: key
      });

      let filterLabel = filterColumn ? filterColumn.title : '无标题';
      let filterName = '';

      if (filterColumn && filterValue && !_.isEmpty(filterValue)) {
        let filterOption = filterColumn.filterOption;
        let filterPlainText = [];

        if (filterColumn.filters) {
          _.forEach(filterColumn.filters, item => {
            if (filterValue.includes(item.value)) {
              filterPlainText.push(item.text);
            }
          });
        }

        if (filterOption) {
          switch (filterOption.type) {
            case 'dateRange':
              filterName = moment(filterValue[0]).format('YYYY/MM/DD') + ' ~ ' + moment(filterValue[1]).format('YYYY/MM/DD');
              break;

            case 'checkbox':
              filterName = this.limitLen(filterPlainText.join(','));
              break;

            case 'search':
              filterName = filterPlainText.length > 0 ? filterPlainText[0] : filterValue;
              break;

            default:
              filterName = filterValue;
              break;
          }
        } else if (filterColumn.filters && !filterColumn.filterMultiple) {
          let filterData = _.find(filterColumn.filters, {
            value: filterValue[0]
          });

          filterName = filterData ? filterData.text : filterName;
        }
      }

      if (filterName) newFilters.push({
        key,
        label: filterLabel,
        value: filterValue,
        name: filterName
      });
    });

    return newFilters;
  }

  componentDidMount() {
    this.props.onRefFilterBar(this);
  }

  render() {
    const _this$props = this.props,
          filters = _this$props.filters,
          totalCount = _this$props.totalCount;
    let theFilters = this.convertFilter(filters);
    let componentCls = `${prefix}-mktable-filterbar`;
    let node = null;
    node = React.createElement("div", {
      className: componentCls
    }, React.createElement("span", null, "\u7B5B\u9009\u6761\u4EF6\uFF1A"), React.createElement("div", {
      className: 'flex-1'
    }, React.createElement("div", {
      className: `${componentCls}-filter-wrapper`
    }, theFilters.map(filter => {
      return React.createElement("div", {
        className: 'filter',
        key: filter.key
      }, React.createElement("span", {
        className: 'filter-label'
      }, filter.label, ":"), React.createElement("span", null, filter.name), React.createElement("span", {
        className: 'filter-close fm fm-cross',
        onClick: e => {
          this.remove(filter);
        }
      }));
    }), React.createElement("div", {
      className: 'filter-data-state'
    }, "\u5171", React.createElement("span", {
      className: 'filter-data-state_num'
    }, totalCount || 0), "\u6761\u8BB0\u5F55"), theFilters.length > 0 ? React.createElement("div", {
      className: 'filter-clear'
    }, React.createElement(_Button, {
      type: "primary",
      size: "small",
      onClick: () => {
        this.clear(theFilters);
      }
    }, "\u91CD\u7F6E")) : null))); //}

    return node;
  }

}

export default FilterStateBar;