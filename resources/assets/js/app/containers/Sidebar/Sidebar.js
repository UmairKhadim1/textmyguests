import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Layout, Icon } from 'antd';
import store from '../../redux/store';
import Scrollbars from '../../components/utility/customScrollBar';
import Menu from '../../components/uielements/menu';
import SidebarWrapper from './sidebar.style';
import Logo from '../../components/utility/logo';
import SidebarSelect from './SidebarSelect';
import Event from '../../type';

const { Sider } = Layout;

const eventMenu = [
  {
    key: 'dashboard',
    path: '',
    icon: <i className="ion-android-clipboard" />,
    label: 'Dashboard',
  },
  {
    key: 'replies',
    path: '/replies',
    icon: <i className="ion-ios-list" />,
    label: 'Reply Stream',
  },
  {
    key: 'messages',
    path: '/messages',
    icon: <i className="ion-android-textsms" />,
    label: 'Messages',
  },
  {
    key: 'guests',
    path: '/guests',
    icon: <i className="ion-person" />,
    label: 'Guests',
  },
  {
    key: 'groups',
    path: '/groups',
    icon: <i className="ion-ios-people" />,
    label: 'Groups',
  },
  {
    key:"direct",
    path: '/direct',
    icon :<Icon type="user" />,
    label: 'Direct',
  },
  {
    key: 'settings',
    path: '/event-settings',
    icon: <i className="ion-android-settings" />,
    label: 'Event Settings',
  },
];

const noEventMenu = [
  {
    key: 'new-event',
    path: '/new-event',
    icon: <Icon type="plus" />,
    label: 'New Event',
  },
];

type Props = {
  app: {
    height: number,
  },
  event?: Object,
  match: {
    url: string,
  },
  location: any,
  customizedTheme: string,
  events: Event[],
  isCollapsed: boolean,
  toggleSidebar: (isCollapsed: ?boolean) => void,
  sidebarWidth: number,
};

class Sidebar extends Component<Props> {
  render() {
    const {
      app,
      customizedTheme,
      events,
      match,
      location,
      isCollapsed,
      toggleSidebar,
      sidebarWidth,
    } = this.props;
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };
    const { url } = match;
    // There's two menu, we select the correct one
    const currentMenu = events && events.length ? eventMenu : noEventMenu;
    // We select the item that match the location in the address bar
    const current = currentMenu
      .filter(menu => {
        if (menu.key === 'dashboard') {
          return location.pathname === `${url}${menu.path}`;
        } else {
          return location.pathname.startsWith(`${url}${menu.path}`);
        }
      })
      .map(menu => menu.key);
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          width={sidebarWidth}
          className={`isomorphicSidebar ${isCollapsed ? 'is-collapsed' : ''}`}
          style={styling}>
          <Logo />
          <Scrollbars style={{ height: scrollheight - 70 }}>
            {events.length ? <SidebarSelect /> : null}
            <Menu
              theme="dark"
              mode="vertical"
              selectedKeys={current}
              className="isoDashboardMenu">
              {currentMenu.map(menu => (
                <Menu.Item key={menu.key}>
                  <Link
                    to={`${url}${menu.path}`}
                    onClick={() => toggleSidebar(true)}>
                    <span className="isoMenuHolder" style={submenuColor}>
                      {menu.icon}
                      <span className="nav-text">{menu.label}</span>
                    </span>
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </Scrollbars>
        </Sider>
        {!isCollapsed && (
          <div className="overlay" onClick={() => toggleSidebar(true)} />
        )}
      </SidebarWrapper>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      app: state.App,
      customizedTheme: 'themedefault',
      events: store.select.Event.allEvents(state),
    }),
    {}
  )(Sidebar)
);
