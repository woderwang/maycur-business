import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import utils from '../utils/utils';
const prefix = utils.prefixCls;

class Empty extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const _this$props = this.props,
          text = _this$props.text,
          type = _this$props.type,
          className = _this$props.className,
          children = _this$props.children;
    return React.createElement("div", {
      className: classnames(`${prefix}-empty`, className)
    }, React.createElement("div", {
      className: `${prefix}-empty-content`
    }, React.createElement("div", {
      className: `${prefix}-empty-circle`
    }, type && type === 'report' ? React.createElement("span", {
      className: "fm fm-allocation"
    }) : React.createElement("span", {
      className: "fm fm-default-page"
    })), React.createElement("div", {
      className: `${prefix}-empty-text`
    }, text), children));
  }

}

Empty.defaultProps = {
  text: '暂无相关数据'
};
Empty.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string
};
export default Empty;