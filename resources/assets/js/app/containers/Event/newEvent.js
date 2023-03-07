import React from 'react';
import { Layout } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import EditEvent from './editEvent';

const { Content } = Layout;

const NewEvent = () => (
  <LayoutWrapper>
    <PageHeader>
      <span className="title">Tell us a few things about your event</span>
    </PageHeader>
    <Content>
      <EditEvent />
    </Content>
  </LayoutWrapper>
);

export default NewEvent;
