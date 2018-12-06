import React from 'react';
import _ from 'lodash';
import { Layout, Menu, Divider } from 'maycur-antd';

const prefix = 'mkbs';
const { Sider } = Layout;
const { SubMenu } = Menu;

const MkSider = (props) => {
	const { menus, pathname, collapsed, onToggleCollapsed } = props;
	let selectedKeys;
	if (menus && menus.length) {
		selectedKeys = _.find(menus, { path: pathname }) ? [pathname] : [menus[0].path];
	}
	return (
		<Sider
			breakpoint="xl"
			className={`${prefix}-sider`}
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
				{menus.map((menu, index) => {
					if (menu.split) {
						// return <Divider key={index} />
						return null;
					}
					menu.menuName = menu.meta.name;
					if (menu.routes) {
						return (
							<SubMenu key={menu.path} title={props.renderMenu(menu)}>
								{menu.routes.map(route => {
									route.menuName = route.meta.name;
									return <Menu.Item key={route.path}>{props.renderMenu(route)}</Menu.Item>
								})}
							</SubMenu>
						)
					} else {
						return (
							<Menu.Item key={menu.path}>
								{props.renderMenu(menu)}
							</Menu.Item>
						)
					}
				})}
			</Menu>
		</Sider>
	);
};

export default MkSider;