import React, { Component } from 'react';
import { Layout } from 'maycur-antd';
import MkHeader from './MkHeader';
import MkSider from './MkSider';
import PropTypes from 'prop-types';

class MkLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  onToggleCollapsed = (collapsed, type) => {
    this.setState({ collapsed: collapsed === undefined ? !this.state.collapsed : collapsed });
  };

  componentDidMount = () => {
    this.setState({ collapsed: !(document.body.clientWidth > 1200) });
  };

  render() {
    const { collapsed } = this.state;
    const { location: { pathname }, setMenus, setSiderMenus, renderMenu, renderSiderMenu, renderContent, logoUrl, noSider } = this.props;
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
          {noSider ? null :
            <MkSider
              collapsed={collapsed}
              onToggleCollapsed={this.onToggleCollapsed}
              pathname={pathname}
              menus={siderMenus}
              renderMenu={renderSiderMenu} />}
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