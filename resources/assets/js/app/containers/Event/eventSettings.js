import React from 'react';
import { Layout, Tabs } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import GeneralSettings from './GeneralSettings';
import EventOwnership from './EventOwnership';
import styled from 'styled-components';

const { Content } = Layout;
const { TabPane } = Tabs;

// This small tweak if to fix a UI bug on iOs.
// The form would overflow (hidden) its parent a little bit
// because of ::before having "display: table; content: '';"
const StyledTabs = styled(Tabs)`
  .ant-tabs-content::before {
    content: none;
  }
`;

const EventSettings = () => (
  <LayoutWrapper>
    <PageHeader>
      <span className="title">Event Settings</span>
    </PageHeader>
    <Content style={{ maxWidth: '100%' }}>
      <StyledTabs>
        <TabPane key="1" tab="General Settings">
          <GeneralSettings />
        </TabPane>
        <TabPane key="2" tab="Ownership">
          <EventOwnership />
        </TabPane>
      </StyledTabs>
    </Content>
  </LayoutWrapper>
);

export default EventSettings;
