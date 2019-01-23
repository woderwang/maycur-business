import "maycur-antd/lib/input/style/css";
import _Input from "maycur-antd/lib/input";
import React, { Component } from 'react';
import utils from '../../../utils/utils';
const prefix = utils.prefixCls;
const Search = _Input.Search;

class FuzzFilter extends Component {
  constructor(props) {
    super(props);

    this.onSearch = value => {
      const _this$props = this.props,
            setSelectedKeys = _this$props.setSelectedKeys,
            confirm = _this$props.confirm;

      if (typeof this.props.filtersSync === 'function') {
        this.props.filtersSync(value).then(data => {
          this.setState({
            result: data
          });
          this.props.setFilters(data);
        });
      } else {
        setSelectedKeys(value);
        confirm();
      }
    };

    this.onClick = item => {
      const _this$props2 = this.props,
            setSelectedKeys = _this$props2.setSelectedKeys,
            confirm = _this$props2.confirm;
      setSelectedKeys(item.code);
      confirm();
    };

    this.state = {
      result: []
    };
  }

  render() {
    const placeholder = this.props.placeholder;
    let result = this.state.result;
    return React.createElement("div", {
      className: `${prefix}-fuzz-filter`
    }, React.createElement(Search, {
      placeholder: placeholder,
      onSearch: this.onSearch
    }), React.createElement("ul", {
      className: 'search-list'
    }, result && result.length > 0 ? result.map((item, index) => {
      return React.createElement("li", {
        onClick: this.onClick.bind(this, item),
        key: index
      }, item.name);
    }) : null));
  }

}

export default FuzzFilter;