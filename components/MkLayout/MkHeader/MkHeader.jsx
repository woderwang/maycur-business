import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon } from 'maycur-antd';
import classNames from 'classnames';
// import logo from 'assets/maycur-logo.png';
// import './style.less';

const { Header } = Layout;

const MkHeader = (props) => {
  const { collapsed, pathname, onToggleCollapsed, leftMenus, rightMenus, logoUrl } = props;

  let selectedKeys = [];
  const menus = leftMenus.concat(rightMenus);
  _.forEach(menus, item => {
    let routeReg = new RegExp(`^${item.path}`);
    if (routeReg.test(pathname)) {
      selectedKeys.push(item.path);
    }
  });

  const formatMenus = (menu) => {
    const menuName = menu.meta && menu.meta.name || '';
    return { ...menu, menuName };
  };

  const toggleCollapsed = () => {
    if (onToggleCollapsed && typeof onToggleCollapsed === 'function') {
      onToggleCollapsed(!collapsed);
    }
  };

  const logoAreaClassName = classNames('mk-logo', {
    'mk-logo-collapsed': collapsed
  });

  return (
    <Header className="mk-header">
      {/* logo area */}
      <div className={logoAreaClassName}>
        {/* logo */}
        <div className="logo-content">
          {/* <span className="fm fm-maycur"></span>
          <span className="logo-text">每刻报</span> */}
          <span><img src={logoUrl} alt="每刻报" /></span>
        </div>
        {/* 收缩按钮 */}
        <Icon onClick={toggleCollapsed} className="trigger" type={collapsed ? 'menu-unfold' : 'menu-fold'} />
      </div>

      {/* menu area */}
      <div className="mk-menus">
        <div className="left-menu">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[menus[0].path]}
            selectedKeys={selectedKeys}
          >
            {leftMenus.map(menu => {
              const formattedMenus = formatMenus(menu);
              return (
                <Menu.Item key={menu.path}>
                  {props.renderMenu(formattedMenus)}
                </Menu.Item>
              )
            })}
          </Menu>
        </div>
        {rightMenus && rightMenus.length ?
          <div className="right-menu">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[menus[0].path]}
              selectedKeys={selectedKeys}
            >
              {rightMenus.map(menu => {
                const formattedMenus = formatMenus(menu);
                return (
                  <Menu.Item key={menu.path}>
                    {props.renderMenu(formattedMenus)}
                  </Menu.Item>
                )
              })}
            </Menu>
          </div>
          : null}
      </div>
    </Header>
  );
}

export default MkHeader;