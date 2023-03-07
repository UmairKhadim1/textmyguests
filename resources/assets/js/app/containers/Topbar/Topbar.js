import React from 'react';
import { connect } from 'react-redux';
import { Layout, Button, Dropdown, Menu, Popover, Icon } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import TopbarWrapper from './topbar.style';
import { dispatch } from '../../redux/store';
import store from '../../redux/store';
import NotificationList from '../Notification/NotificationList';
import NotificationOutlined from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';

const { Header } = Layout;

const DropdownMenu = (
  url,
  logout,
  logouting,
  impersonating,
  leaveImpersonation,
  leavingImpersonation,
  history
) => (
  <Menu>
    <Menu.Item key="0" style={{ minWidth: '150px' }}>
      <Link to={`${url}/user-settings`}>User Settings</Link>
      
    </Menu.Item>
    <Menu.Item key="1">
      <Link to={`${url}/invoices`}>Invoices</Link>
    </Menu.Item>
    {/* <Menu.Item key="2">
      <Link to={`${url}/payments`}>Payments</Link>
    </Menu.Item> */}
    <Menu.Divider />
    <Menu.Item key="3" style={{ textAlign: 'center' }}>
      <Button
        className="log-out-button"
        disabled={impersonating ? leavingImpersonation : logouting}
        loading={impersonating ? leavingImpersonation : logouting}
        onClick={() =>
          impersonating
            ? leaveImpersonation()
            : logout({
                cb: () => {
                  history.push('/signin');
                  dispatch({ type: 'RESET_USER_STATE' });
                },
              })
        }
        type={impersonating ? 'danger' : 'dashed'}>
        {impersonating ? 'Leave impersonation' : 'Log Out'}
      </Button>
    </Menu.Item>
  </Menu>
);

const Topbar = ({
  url,
  logout,
  logouting,
  history,
  toggleSidebar,
  impersonating,
  leaveImpersonation,
  leavingImpersonation,
}: {
  url: string,
  logout: () => void,
  logouting: boolean,
  history: Object,
  toggleSidebar: (isCollapsed: ?boolean) => void,
  impersonating: boolean,
  leaveImpersonation: () => void,
  leavingImpersonation: boolean,
}) => {
  const styling = {
    position: 'fixed',
    width: '100%',
    height: 70,
  };

  const text = (
    <div className="d-flex" style={{ alignItems: 'center' }}>
      <Text style={{ paddingRight: '5px' }}>Notification</Text>
      <Icon type="question-circle" theme="filled" />
    </div>
  );
  return (
    <TopbarWrapper>
      <Header style={styling} className="isomorphicTopbar">
        {/* ul doesn't show on mobile */}
        <ul className="isoRight nav">
          <li className="">
            <Link to={`${url}/user-settings`}>User Settings</Link>
          </li>
          <li>
            <Link to={`${url}/invoices`}>Invoices</Link>
          </li>
          <li>
            <Popover
              placement="bottom"
              content={<NotificationList />}
              title={text}
              trigger="click">
              <b>
                <span>Notifications</span>
              </b>
            </Popover>
          </li>
          {/* <li>
            <Link to={`${url}/notification`}>notification</Link>
          </li>
          <li>
            <Link to={`${url}/notification`}>Notification</Link>
          </li> */}
          <li>
            <Button
              className="log-out-button"
              disabled={impersonating ? leavingImpersonation : logouting}
              loading={impersonating ? leavingImpersonation : logouting}
              onClick={() =>
                impersonating
                  ? leaveImpersonation()
                  : logout({
                      cb: () => {
                        history.push('/signin');
                        dispatch({ type: 'RESET_USER_STATE' });
                      },
                    })
              }
              type={impersonating ? 'danger' : 'dashed'}>
              {impersonating ? 'Leave impersonation' : 'Log Out'}
            </Button>
          </li>
        </ul>
        {/* Following is for mobile */}
        <div className="isoLeft" onClick={toggleSidebar}>
          <i className="ion-android-menu menu-icon" />
        </div>
        <div className="isoRight dropdown-menu">
          <Dropdown
            overlay={DropdownMenu(
              url,
              logout,
              logouting,
              impersonating,
              leaveImpersonation,
              leavingImpersonation,
              history
            )}
            trigger={['click']}>
            <span>
              <i className="ion-person user-icon" />
              <i className="ion-arrow-down-b" />
            </span>
          </Dropdown>
        </div>
      </Header>
    </TopbarWrapper>
  );
};

export default connect(
  state => ({
    logouting: state.loading.effects.Auth.logout,
    impersonating: store.select.Auth.isImpersonating(state),
    leavingImpersonation: state.loading.effects.Auth.leaveImpersonation,
  }),
  ({ Auth: { logout, leaveImpersonation } }) => ({ logout, leaveImpersonation })
)(withRouter(Topbar));
