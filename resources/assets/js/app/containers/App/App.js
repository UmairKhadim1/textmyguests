// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { Layout } from 'antd';
import { Debounce } from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import { ThemeProvider } from 'styled-components';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import AppRouter from './AppRouter';
import { siteConfig } from '../../config';
import themes from '../../config/themes';
import AppHolder from './commonStyle';
import './global.css';

const { Content, Footer } = Layout;
const sidebarWidth = 240;

type Props = {
  loadUser: () => void,
  loadEvents: () => void,
  match: {
    url: string,
  },
  toggleAll: ({ height: number, width: number }) => void,
  inviteToken: string,
  processInvitation: (inviteToken: string) => void,
  processingInvitation: boolean,
};

export class App extends Component<Props> {
  constructor(props: Props) {
    super(props);

    const mql = window.matchMedia('(min-width: 768px)');

    this.state = {
      sidebarIsCollapsed: !mql.matches,
    };

    mql.onchange = e => {
      this.setState({ sidebarIsCollapsed: !e.matches });
    };
  }

  async componentDidMount() {
    await this.props.loadUser();
    Echo.private(`App.User.${this.props.user.id}`).notification(
      notification => {
        this.props.loadNotification(notification);
      }
    );

    if (this.props.inviteToken) {
      this.props.processInvitation(this.props.inviteToken);
    } else {
      this.props.loadEvents();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.processingInvitation && !this.props.processingInvitation) {
      this.props.loadEvents();
    }
    // console.log(this.props);
  }

  toggleSidebar = (sidebarIsCollapsed: ?boolean) => {
    if (typeof sidebarIsCollapsed === 'boolean') {
      this.setState({ sidebarIsCollapsed });
    } else {
      this.setState(prevState => ({
        sidebarIsCollapsed: !prevState.sidebarIsCollapsed,
      }));
    }
  };

  render() {
    const { url } = this.props.match;
    return (
      <ThemeProvider theme={themes.themedefault}>
        <AppHolder sidebarWidth={sidebarWidth}>
          <Layout style={{ minHeight: '100vh' }}>
            <Debounce time="1000" handler="onResize">
              <WindowResizeListener
                onResize={windowSize =>
                  this.props.toggleAll({
                    width: windowSize.windowWidth,
                    height: windowSize.windowHeight,
                  })
                }
              />
            </Debounce>
            <Topbar url={url} toggleSidebar={this.toggleSidebar.bind(this)} />
            <Layout
              className="bodyLayout"
              style={{
                flexDirection: 'row',
                overflowX: 'hidden',
              }}>
              <Sidebar
                url={url}
                toggleSidebar={this.toggleSidebar.bind(this)}
                isCollapsed={this.state.sidebarIsCollapsed}
                sidebarWidth={sidebarWidth}
              />
              <Layout
                className="isoContentMainLayout"
                style={{
                  minHeight: '100vh',
                }}> 
                <Content
                  className="isomorphicContent"
                  style={{
                    padding: '70px 0 0',
                    flexShrink: '0',
                    background: '#f1f3f6',
                  }}>
                  <AppRouter url={url} />
                </Content>

                <Footer
                  style={{
                    background: '#ffffff',
                    textAlign: 'center',
                    borderTop: '1px solid #ededed',
                  }}>
                  {siteConfig.footerText}
                </Footer>
              </Layout>
            </Layout>
          </Layout>
        </AppHolder>
      </ThemeProvider>
    );
  }
}

export default connect(
  state => ({
    inviteToken: store.select.Auth.inviteToken(state),
    processingInvitation: state.loading.effects.Auth.processInvitation,
    user: store.select.Auth.user(state),
  }),
  ({ App, Auth, Event, Test }) => ({
    toggleAll: App.toggleAll,
    loadEvents: Event.loadEvents,
    loadUser: Auth.me,
    processInvitation: Auth.processInvitation,
    loadNotification: Test.loadNotification,
  })
)(App);
