import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import utils from '../utils/utils';
const prefix = utils.prefixCls;

class MkDropdown extends Component {
  constructor(props) {
    super(props);

    this.remove = e => {
      const node = findDOMNode(this);

      const isParent = (node, p) => {
        if (!node.parentNode) {
          return false;
        }

        if (node === p || node.parentNode === p) {
          return true;
        } else {
          return isParent(node.parentNode, p);
        }
      };

      if (!this.popup || isParent(e.target, node) || isParent(e.target, this.popup)) {
        return;
      }

      if (this.popup.parentNode) {
        ReactDom.unmountComponentAtNode(this.popup);
        this.popup.parentNode.removeChild(this.popup);
      }
    };

    this.state = {};
  }

  appendDom(node) {
    const _this$props = this.props,
          left = _this$props.left,
          top = _this$props.top,
          test = _this$props.test;

    const _left = node.getBoundingClientRect().left - 12 + left;

    const _top = node.getBoundingClientRect().top + top;

    const cssText = `left:${_left}px;top:${_top}px;`;
    const popup = this.popup = document.createElement("div");
    popup.className = `${prefix}-dropdown ${test ? `${prefix}-dropdown-test` : null}`;
    popup.style.cssText = cssText;
    document.body.appendChild(popup);
    ReactDom.render(this.props.overlay, popup);
  }

  componentDidMount() {
    const node = findDOMNode(this);
    const _this$props2 = this.props,
          trigger = _this$props2.trigger,
          visible = _this$props2.visible,
          test = _this$props2.test,
          disabled = _this$props2.disabled;

    if (disabled) {
      return;
    }

    if (visible || test) {
      this.appendDom(node);
      return;
    }

    if (trigger.includes('hover')) {
      node.onmouseenter = () => {
        this.appendDom(node);
      };
    }

    if (trigger.includes('click')) {
      node.onclick = e => {
        e.stopPropagation();
        this.appendDom(node);
      };
    }

    document.addEventListener('mousemove', this.remove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.remove);
  }

  render() {
    let _this$props3 = this.props,
        children = _this$props3.children,
        disabled = _this$props3.disabled;
    children = React.Children.map(children, (o, i) => {
      const className = o.props.className;
      return React.cloneElement(o, {
        key: i,
        className: `${className} ${disabled ? `${prefix}-disabled` : null}`
      });
    });
    return React.createElement(React.Fragment, null, children);
  }

}

MkDropdown.defaultProps = {
  trigger: ['hover'],
  top: 0,
  left: 0
};
MkDropdown.propTypes = {
  trigger: PropTypes.array,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  test: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number
};
export default MkDropdown;