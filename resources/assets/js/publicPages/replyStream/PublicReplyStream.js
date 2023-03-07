import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppHolder from '../../app/containers/App/commonStyle';
import themes from '../../app/config/themes';
import { Layout } from 'antd';
import { siteConfig } from '../../app/config';
import Topbar from './Topbar';
import PublicReplyStreamRoutes from './PublicReplyStreamRouter';

const { Content, Footer } = Layout;

const PublicReplyStream: React.FC = () => (
  <ThemeProvider theme={themes.themedefault}>
    <AppHolder>
      <Layout style={{ minHeight: '100vh', height: '100px' }}>
        {/* Topbar */}
        <Topbar />
        <Layout className="isoContentMainLayout">
          <Content
            className="isomorphicContent"
            style={{
              padding: '90px 0px 0px',
              flexShrink: '0',
              background: '#f1f3f6',
            }}>
            {/* <Stream /> */}
            <PublicReplyStreamRoutes />
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
    </AppHolder>
  </ThemeProvider>
);

export default PublicReplyStream;
