import "maycur-antd/lib/popover/style/css";
import _Popover from "maycur-antd/lib/popover";
import "maycur-antd/lib/checkbox/style/css";
import _Checkbox from "maycur-antd/lib/checkbox";
import "core-js/modules/web.dom.iterable";
import React, { Component } from 'react';
import utils from '../../utils/utils';
import _ from 'lodash';
const prefix = utils.prefixCls;

class PopContent extends Component {
  constructor(props) {
    super(props);

    this.onChange = checkedValues => {
      this.setState({
        checkedValues
      });
    };

    this.getValue = () => {
      const _this$state = this.state,
            options = _this$state.options,
            checkedValues = _this$state.checkedValues;
      ;
      let outValues = [];

      _.forEach(options, item => {
        if (checkedValues.includes(item.code)) {
          outValues.push(item);
        }
      });

      return outValues;
    };

    this.setDefaultValue = () => {
      const defaultValue = this.props.defaultValue;
      let convertValue = [];

      _.forEach(defaultValue, option => {
        convertValue.push(option.code);
      });

      return convertValue;
    };

    this.state = {
      options: props.options || [],
      checkedValues: this.setDefaultValue()
    };
  }

  componentDidUpdate(prevProps) {
    const visible = this.props.visible;

    if (prevProps.visible !== visible && visible) {
      this.setState({
        checkedValues: this.setDefaultValue()
      });
    }
  }

  render() {
    const _this$state2 = this.state,
          options = _this$state2.options,
          checkedValues = _this$state2.checkedValues;
    return React.createElement("div", {
      className: `${prefix}-popcontent`
    }, React.createElement(_Checkbox.Group, {
      value: checkedValues,
      onChange: this.onChange
    }, options.map(optionItem => {
      return React.createElement("div", {
        key: optionItem.code,
        className: `${prefix}-option-child`
      }, React.createElement(_Checkbox, {
        value: optionItem.code
      }, optionItem.name));
    })));
  }

}

class PopSelect extends Component {
  constructor(props) {
    super(props);

    this.onVisibleChange = visible => {
      const close = this.props.close;
      this.setState({
        visible
      });

      if (!visible && this.contentRef) {
        if (typeof close === 'function') {
          close(this.contentRef.getValue());
        }
      }
    };

    this.onValueChange = () => {};

    this.state = {
      visible: false
    };
  }

  render() {
    const _this$props = this.props,
          defaultValue = _this$props.defaultValue,
          children = _this$props.children,
          options = _this$props.options;
    const visible = this.state.visible;
    let popContent = React.createElement(PopContent, {
      visible: visible,
      ref: _ref => {
        this.contentRef = _ref;
      },
      options: options,
      defaultValue: defaultValue
    });
    return React.createElement(_Popover, {
      content: popContent,
      trigger: "click",
      placement: "bottomLeft",
      overlayClassName: `${prefix}-select-popover`,
      autoAdjustOverflow: true,
      onVisibleChange: this.onVisibleChange
    }, children);
  }

}

export default PopSelect;