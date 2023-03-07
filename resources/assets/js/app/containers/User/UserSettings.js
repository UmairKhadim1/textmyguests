import React from 'react';
import { Layout, Tabs } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import BasicInfoForm from './BasicInfo';
import ChangePasswordForm from './ChangePassword';

const { Content } = Layout;
const { TabPane } = Tabs;

const UserSettings = () => (
  <LayoutWrapper>
    <PageHeader>
      <span className="title">User Settings</span>
    </PageHeader>
    <Content style={{ maxWidth: '100%' }}>
      <Tabs>
        <TabPane key="1" tab="Basic Info">
          <BasicInfoForm />
        </TabPane>
        <TabPane key="2" tab="Change Password">
          <ChangePasswordForm />
        </TabPane>
      </Tabs>
    </Content>
  </LayoutWrapper>
);

export default UserSettings;
