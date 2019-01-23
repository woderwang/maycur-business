import "maycur-antd/lib/popover/style/css";
import _Popover from "maycur-antd/lib/popover";
import React, { Component } from 'react';
import utils from '../utils/utils';
let prefixCls = utils.prefixCls;

class PageHeaderBar extends Component {
  constructor(props) {
    super(props);

    this.back = () => {
      window.history.go(-1);
    };

    this.close = () => {
      const closeCallBack = this.props.closeCallBack;

      if (typeof closeCallBack === 'function') {
        closeCallBack();
      }
    };

    this.state = {};
  }

  render() {
    const _this$props = this.props,
          title = _this$props.title,
          pageDescription = _this$props.pageDescription,
          witGoBack = _this$props.witGoBack,
          withClose = _this$props.withClose;
    let basicCls = `${prefixCls}-pageheader-bar`;
    return React.createElement("div", {
      className: basicCls
    }, witGoBack ? React.createElement("span", {
      className: `${basicCls}_back mkbs-fm mkbs-fm-arrow-left`,
      onClick: this.back
    }) : null, React.createElement("span", {
      className: `${basicCls}_title`
    }, title), React.createElement("div", {
      className: 'mkbs-flex-1'
    }), pageDescription ? React.createElement(_Popover, {
      autoAdjustOverflow: true,
      content: pageDescription,
      placement: "bottomRight"
    }, React.createElement("div", {
      className: `${basicCls}_help`
    }, React.createElement("span", null), "\u4F7F\u7528\u8BF4\u660E")) : null, withClose ? React.createElement("span", {
      className: `${basicCls}_close mkbs-fm mkbs-fm-close`,
      onClick: this.close
    }) : null);
  }

}

PageHeaderBar.defaultProps = {
  witGoBack: true,
  withClose: false
};
export default PageHeaderBar;