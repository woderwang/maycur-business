import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.regexp.match";
import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/es6.regexp.split";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import PropTypes from 'prop-types';
import utils from '../utils/utils';
const prefix = utils.prefixCls;
const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];

function hashCode(str) {
  str = str || '';

  if (Array.prototype.reduce) {
    return str.split('').reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  var hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    var character = str.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
}

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abbrName: '',
      color: ''
    };
    this.getAbbrName = this.getAbbrName.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onClickAvatar = this.onClickAvatar.bind(this);
  }

  componentDidMount() {
    const user = this.props.user;
    this.updateState(user);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const user = nextProps.user;
    this.updateState(user);
  }

  updateState(user) {
    if (user) {
      let abbrName = this.getAbbrName(user.userName);
      var idx = Math.abs(hashCode(user.userName)) % colors.length;
      this.setState({
        abbrName,
        color: colors[idx]
      });
    }
  }

  onClickAvatar(e) {
    e.stopPropagation();
    const _this$props = this.props,
          user = _this$props.user,
          onClick = _this$props.onClick;

    if (typeof onClick === 'function') {
      onClick();
    }
  }

  getAbbrName(name) {
    if (!name) return '';
    let chineseReg = new RegExp('[\u4E00-\uFA29\uE7C7-\uE7F3]+', 'g');
    let wordReg = new RegExp('[A-Za-z]{1,4}');
    let result = '';
    let m = (name || '').match(chineseReg);

    if (m && m.length !== 0) {
      result = m[0];

      if (result && result.length > 2) {
        result = result.substring(result.length - 2, result.length);
      }
    }

    if (!result) {
      m = (name || '').match(wordReg);

      if (m && m.length !== 0) {
        result = m[0];
      }
    }

    if (!result) {
      result = name.substr(0, 1);
    }

    return result;
  }

  render() {
    const _this$props2 = this.props,
          customStyle = _this$props2.customStyle,
          avatarUrl = _this$props2.avatarUrl;
    return React.createElement(React.Fragment, null, avatarUrl ? React.createElement("img", {
      className: `${prefix}-avatar-img`,
      src: avatarUrl,
      alt: "\u5934\u50CF",
      style: _objectSpread({}, customStyle)
    }) : React.createElement("span", {
      onClick: this.onClickAvatar,
      className: `${prefix}-avatar ${this.state.color || 'c0'}`,
      style: _objectSpread({}, customStyle)
    }, React.createElement("span", null, this.state.abbrName || '头像')));
  }

}

Avatar.propTypes = {
  /** 个人用户信息  */
  user: PropTypes.object,

  /** 自定义组件style  */
  customStyle: PropTypes.object
};
export default Avatar;