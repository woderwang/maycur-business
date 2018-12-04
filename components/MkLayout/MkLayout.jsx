import React, { Component } from 'react';
import _ from 'lodash';
// import Debounce from 'lodash-decorators/debounce';
import { Layout, Avatar } from 'maycur-antd';
import MkHeader from './MkHeader';
import MkSider from './MkSider';
// import { Link } from 'dva/router';
// import NormalRouter from 'router/NormalRouter';
import PropTypes from 'prop-types';
// import routerList from 'router/routerList';
// import './Layout.less';

class MkLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  // renderContent = () => {
  //   const { location } = this.props;
  //   return (
  //     <div className={styles.content}>
  //       <NormalRouter location={location} />
  //     </div>
  //   );
  // };

  // renderMenu = (menu) => {
  //   return (
  //     menu.skip ?
  //       <a href={`/admin/${window.location.search}#${menu.path}`}>{menu.menuName}</a> :
  //       <Link replace to={menu.path}>
  //         {menu.name === 'profile' ? <Avatar /> : menu.menuName}
  //       </Link>
  //   )
  // };

  // renderSiderMenu = (menu) => {
  //   return (
  //     <Link replace to={menu.path}>
  //       <span className={`fm ${menu.icon}`}></span>
  //       <span>{menu.menuName}</span>
  //     </Link>
  //   );
  // };

  // getMenus = () => {
  //   const leftMenus = [];
  //   const rightMenus = [];
  //   const rightMenuId = ['/profile'];
  //   _.each(routerList, (route) => {
  //     if (rightMenuId.includes(route.path)) {
  //       rightMenus.push(route);
  //     } else {
  //       leftMenus.push(route);
  //     }
  //   });
  //   return {
  //     leftMenus,
  //     rightMenus
  //   };
  // };

  // getSiderMenus = () => {
  //   const { location: { pathname } } = this.props;
  //   const pathArr = pathname.split('/');
  //   const menuName = pathArr[1] || 'home';
  //   const currentMenu = _.filter(routerList, { name: menuName })[0] || {};
  //   const siderMenus = currentMenu.routes || [];
  //   return siderMenus;
  // };

  onToggleCollapsed = (collapsed, type) => {
    this.setState({ collapsed: collapsed === undefined ? !this.state.collapsed : collapsed });
  };

  // @Debounce(10)
  // resize = () => {
  // const shouldCollapsed = !(document.body.clientWidth > 1200);
  // this.setState({ collapsed: shouldCollapsed });
  // };

  componentDidMount = () => {
    // this.resize();
    // window.addEventListener('resize', () => this.resize());
    this.setState({ collapsed: !(document.body.clientWidth > 1200) });
  };

  componentWillUnmount = () => {
    // window.removeEventListener('resize', this.resize);
  };

  render() {
    const { collapsed } = this.state;
    const { location: { pathname }, setMenus, setSiderMenus, renderMenu, renderSiderMenu, renderContent, logoUrl } = this.props;
    const menus = setMenus();
    const siderMenus = setSiderMenus();
    return (
      <Layout className="page-container">
        <MkHeader
          collapsed={collapsed}
          onToggleCollapsed={this.onToggleCollapsed}
          pathname={pathname}
          leftMenus={menus.leftMenus}
          rightMenus={menus.rightMenus}
          renderMenu={renderMenu}
          logoUrl={logoUrl} />
        <Layout className="section">
          <MkSider
            collapsed={collapsed}
            pathname={pathname}
            menus={siderMenus}
            renderMenu={renderSiderMenu} />
          <Layout className="content">
            {renderContent()}
          </Layout>
        </Layout>
      </Layout>
    )
  }
}


MkLayout.propTypes = {
  setMenus: PropTypes.func,
  renderMenu: PropTypes.func,
  setSiderMenus: PropTypes.func,
  renderSiderMenu: PropTypes.func,
  renderContent: PropTypes.func
}

export default MkLayout;