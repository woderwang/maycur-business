import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu } from 'maycur-antd';
// import './MkSider.less';

const { Sider } = Layout;

const MkSider = (props) => {
  const { menus, pathname, collapsed, onToggleCollapsed } = props;
  let selectedKeys;
  if (menus && menus.length) {
    selectedKeys = _.find(menus, { path: pathname }) ? [pathname] : [menus[0].path];
  }
  return (
    <Sider
      breakpoint="xl"
      className="mk-sider"
      width={240}
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={56}
      onCollapse={onToggleCollapsed}>
      <Menu
        theme="light"
        mode="inline"
        inlineIndent="40"
        selectedKeys={selectedKeys}
        style={{ height: '100%', borderRight: 0 }}
      >
        {menus.map(menu => {
          menu.menuName = menu.meta.name;
          return (
            <Menu.Item key={menu.path}>
              {props.renderMenu(menu)}
            </Menu.Item>
          )
        })}
      </Menu>
    </Sider>
  );
};

export default MkSider;