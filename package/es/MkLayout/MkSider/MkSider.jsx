import "core-js/modules/es6.regexp.split";
import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/web.dom.iterable";
import "maycur-antd/lib/menu/style/css";
import _Menu from "maycur-antd/lib/menu";
import "maycur-antd/lib/layout/style/css";
import _Layout from "maycur-antd/lib/layout";
import React from 'react';
import _ from 'lodash';
import utils from '../../utils/utils';
import ScrollBar from '../../ScrollBar';
const prefix = utils.prefixCls;
const Sider = _Layout.Sider;
const SubMenu = _Menu.SubMenu;

function loopPath(menus, pathArr) {
  let matchedMenu;
  if (!pathArr) return;

  _.forEach(menus, menu => {
    let pathReg = new RegExp('^' + menu.path);

    if (menu.routes) {
      let childMenu = loopPath(menu.routes, pathArr);
      if (childMenu) matchedMenu = childMenu;
    } else {
      if (pathReg.test(pathArr.join('/'))) matchedMenu = menu;
    }
  });

  return matchedMenu;
}

const MkSider = props => {
  const menus = props.menus,
        pathArr = props.pathArr,
        collapsed = props.collapsed,
        onToggleCollapsed = props.onToggleCollapsed;
  let matchedMenu = loopPath(menus, pathArr);
  let selectedKeys = matchedMenu ? [matchedMenu.path] : [];
  const defaultOpenKeys = pathArr.length > 2 ? [pathArr.slice(0, pathArr.length - 1).join('/')] : [];
  return React.createElement(ScrollBar, {
    className: `${prefix}-sider-scroll`
  }, React.createElement(Sider, {
    breakpoint: "xl",
    theme: "light",
    className: `${prefix}-sider`,
    width: 220,
    trigger: null,
    collapsible: true,
    collapsed: collapsed,
    collapsedWidth: 56,
    onCollapse: onToggleCollapsed
  }, React.createElement(_Menu, {
    theme: "light",
    mode: "inline",
    inlineIndent: "44",
    selectedKeys: selectedKeys,
    defaultOpenKeys: defaultOpenKeys,
    style: {
      height: '100%',
      borderRight: 0
    }
  }, menus.map((menu, index) => {
    /*TODO: 设置菜单根据功能块划分*/
    if (menu.split) {
      return React.createElement(_Menu.Divider, {
        key: index
      });
    }

    let MenuContent;
    menu.menuName = menu.meta.name;
    const content = props.renderMenu(menu);

    if (!content) {
      return null;
    }

    MenuContent = menu.hasSub ? React.createElement(SubMenu, {
      key: menu.path,
      title: props.renderMenu(menu)
    }, menu.routes.map((route, index) => {
      route.menuName = route.meta.name;
      return React.createElement(_Menu.Item, {
        key: route.path
      }, props.renderMenu(route));
    })) : React.createElement(_Menu.Item, {
      key: menu.path
    }, content);
    return MenuContent;
  }))));
};

export default MkSider;