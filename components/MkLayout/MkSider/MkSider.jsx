import React from 'react';
import _ from 'lodash';
import { Layout, Menu, Divider } from 'maycur-antd';

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
				{menus.map((menu, index) => {
					if (menu.split) {
						return <Divider />
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
						const style = menu.split ? { marginTop: '20px', borderTop: '1px solid #eee' } : null;
						return (
							<Menu.Item key={menu.path} style={style}>
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