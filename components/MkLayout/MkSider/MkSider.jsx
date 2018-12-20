import React from 'react';
import _ from 'lodash';
import { Layout, Menu, Divider } from 'maycur-antd';

const prefix = 'mkbs';
const { Sider } = Layout;
const { SubMenu } = Menu;
function loopPath(menus,pathArr) {
	let matchedMenu;
	if(!pathArr) return;
	_.forEach(menus, menu => {
		let pathReg = new RegExp('^' + menu.path);
		if (menu.routes){
			let childMenu = loopPath(menu.routes,pathArr);			
			if(childMenu) matchedMenu = childMenu;
		}else{
			if (pathReg.test(pathArr.join('/'))) matchedMenu = menu;
		}			
	});
	return matchedMenu;
}
const MkSider = (props) => {
	const { menus, pathArr, collapsed, onToggleCollapsed } = props;	
	let matchedMenu = loopPath(menus,pathArr)	
	let selectedKeys = matchedMenu?[matchedMenu.path]:[];	
	const defaultOpenKeys = pathArr.length > 2 ? [pathArr.slice(0, pathArr.length - 1).join('/')] : [];
	return (
		<Sider
			breakpoint="xl"
			theme="light"
			className={`${prefix}-sider`}
			width={220}
			trigger={null}
			collapsible
			collapsed={collapsed}
			collapsedWidth={56}
			onCollapse={onToggleCollapsed}>
			<Menu
				theme="light"
				mode="inline"
				inlineIndent="44"
				selectedKeys={selectedKeys}
				defaultOpenKeys={defaultOpenKeys}
				style={{ height: '100%', borderRight: 0 }}
			>
				{menus.map((menu, index) => {
					/*TODO: 设置菜单根据功能块划分*/
					if (menu.split) {
						return <Menu.Divider key={index} />;
					}
					let MenuContent;

					menu.menuName = menu.meta.name;
					const content = props.renderMenu(menu);
					if (!content) {
						return null;
					}
					MenuContent = menu.hasSub ?
						(
							<SubMenu key={menu.path} title={props.renderMenu(menu)}>
								{menu.routes.map((route, index) => {
									route.menuName = route.meta.name;
									return <Menu.Item key={route.path}>{props.renderMenu(route)}</Menu.Item>
								})}
							</SubMenu>
						) :
						(
							<Menu.Item key={menu.path}>
								{content}
							</Menu.Item>
						);

					return MenuContent;
				})}
			</Menu>
		</Sider>
	);
};

export default MkSider;