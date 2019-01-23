import "core-js/modules/web.dom.iterable";
import "maycur-antd/lib/icon/style/css";
import _Icon from "maycur-antd/lib/icon";
import "core-js/modules/es6.regexp.constructor";
import "maycur-antd/lib/menu/style/css";
import _Menu from "maycur-antd/lib/menu";
import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import utils from '../../utils/utils';
const prefix = utils.prefixCls;
const Header = _Layout.Header;
const SubMenu = _Menu.SubMenu;

const MkHeader = props => {
  const collapsed = props.collapsed,
        pathArr = props.pathArr,
        onToggleCollapsed = props.onToggleCollapsed,
        leftMenus = props.leftMenus,
        rightMenus = props.rightMenus;
  const menus = leftMenus.concat(rightMenus);

  let matchedMenu = _.find(menus, menu => {
    let pathReg = new RegExp('^' + menu.path);
    return pathReg.test(pathArr.join('/'));
  });

  let selectedKeys = matchedMenu ? [matchedMenu.path] : [];

  const formatMenus = menu => {
    const menuName = menu.meta && menu.meta.name || '';
    return _objectSpread({}, menu, {
      menuName
    });
  };

  const toggleCollapsed = () => {
    if (onToggleCollapsed && typeof onToggleCollapsed === 'function') {
      onToggleCollapsed(!collapsed);
    }
  };

  const logoAreaClassName = classNames(`${prefix}-header-logo`, {
    [`${prefix}-header-logo-collapsed`]: collapsed
  });

  const onOpenChange = openKeys => {// debugger
  };

  return React.createElement(Header, {
    className: `${prefix}-header`
  }, React.createElement("div", {
    className: logoAreaClassName
  }, React.createElement("div", {
    className: "logo-content"
  }, React.createElement("span", null, React.createElement("img", {
    src: "https://dt-prod.oss-cn-hangzhou.aliyuncs.com/MK/maycur-logo.png?Expires=4699823897&OSSAccessKeyId=LTAIW3TdsFRisDtO&Signature=Zt%2FTp0ueRbZeUQN9xOQjZjI5iNI%3D",
    alt: "\u6BCF\u523B\u62A5"
  }))), React.createElement(_Icon, {
    onClick: toggleCollapsed,
    className: "trigger",
    type: collapsed ? 'menu-unfold' : 'menu-fold'
  })), React.createElement("div", {
    className: `${prefix}-header-menus`
  }, React.createElement("div", {
    className: "left-menu"
  }, React.createElement(_Menu, {
    theme: "dark",
    mode: "horizontal",
    defaultSelectedKeys: [menus[0].path],
    selectedKeys: selectedKeys
  }, leftMenus.map(menu => {
    const formattedMenus = formatMenus(menu);
    const content = props.renderMenu(formattedMenus);

    if (!content) {
      return null;
    }

    return React.createElement(_Menu.Item, {
      key: menu.path
    }, content);
  }))), rightMenus && rightMenus.length ? React.createElement("div", {
    className: "right-menu"
  }, React.createElement(_Menu, {
    theme: "dark",
    mode: "horizontal",
    defaultSelectedKeys: [menus[0].path],
    selectedKeys: selectedKeys,
    onOpenChange: onOpenChange
  }, rightMenus.map(menu => {
    const formattedMenus = formatMenus(menu);
    const MenuContent = menu.hasSub ? React.createElement(SubMenu, {
      key: menu.path,
      title: React.createElement("span", {
        className: `fm ${menu.icon}`
      })
    }, menu.routes.map(route => {
      route.menuName = route.meta.name;
      return React.createElement(_Menu.Item, {
        key: route.path
      }, props.renderMenu(route));
    })) : React.createElement(_Menu.Item, {
      key: menu.path
    }, props.renderMenu(formattedMenus));
    return MenuContent;
  }))) : null));
};

export default MkHeader;