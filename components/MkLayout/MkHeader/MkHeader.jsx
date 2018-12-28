import React from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon } from 'maycur-antd';
import classNames from 'classnames';

const prefix = 'mkbs';
const { Header } = Layout;
const { SubMenu } = Menu;

const MkHeader = (props) => {
  const { collapsed, pathArr, onToggleCollapsed, leftMenus, rightMenus } = props;
  const menus = leftMenus.concat(rightMenus);

  let matchedMenu = _.find(menus, menu => {
    let pathReg = new RegExp('^' + menu.path);
    return pathReg.test(pathArr.join('/'));
  });

  let selectedKeys = matchedMenu ? [matchedMenu.path] : [];

  const formatMenus = (menu) => {
    const menuName = menu.meta && menu.meta.name || '';
    return { ...menu, menuName };
  };

  const toggleCollapsed = () => {
    if (onToggleCollapsed && typeof onToggleCollapsed === 'function') {
      onToggleCollapsed(!collapsed);
    }
  };

  const logoAreaClassName = classNames(`${prefix}-header-logo`, {
    [`${prefix}-header-logo-collapsed`]: collapsed
  });

  const onOpenChange = (openKeys) => {
    // debugger
  }

  return (
    <Header className={`${prefix}-header`}>
      {/* logo area */}
      <div className={logoAreaClassName}>
        {/* logo */}
        <div className="logo-content">
          <span><img src="https://dt-prod.oss-cn-hangzhou.aliyuncs.com/MK/maycur-logo.png?Expires=4699823897&OSSAccessKeyId=LTAIW3TdsFRisDtO&Signature=Zt%2FTp0ueRbZeUQN9xOQjZjI5iNI%3D" alt="每刻报" /></span>
        </div>
        {/* 收缩按钮 */}
        <Icon onClick={toggleCollapsed} className="trigger" type={collapsed ? 'menu-unfold' : 'menu-fold'} />
      </div>

      {/* menu area */}
      <div className={`${prefix}-header-menus`}>
        {/*  头部左侧菜单 */}
        <div className="left-menu">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[menus[0].path]}
            selectedKeys={selectedKeys}
          >
            {leftMenus.map((menu) => {
              const formattedMenus = formatMenus(menu);
              const content = props.renderMenu(formattedMenus);
              if (!content) {
                return null;
              }
              return (
                <Menu.Item key={menu.path}>
                  {content}
                </Menu.Item>
              )
            })}
          </Menu>
        </div>

        {/* 头部右侧菜单 */}
        {rightMenus && rightMenus.length ?
          <div className="right-menu">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[menus[0].path]}
              selectedKeys={selectedKeys}
              onOpenChange={onOpenChange}
            >
              {rightMenus.map((menu) => {
                const formattedMenus = formatMenus(menu);
                const MenuContent = menu.hasSub ? (
                  <SubMenu key={menu.path} title={<span className={`fm ${menu.icon}`}></span>}>
                    {menu.routes.map((route) => {
                      route.menuName = route.meta.name;
                      return <Menu.Item key={route.path}>{props.renderMenu(route)}</Menu.Item>
                    })}
                  </SubMenu>
                ) : (
                    <Menu.Item key={menu.path}>
                      {props.renderMenu(formattedMenus)}
                    </Menu.Item>
                  )
                return MenuContent;
              })}
            </Menu>
          </div>
          : null}
      </div>
    </Header>
  );
}

export default MkHeader;