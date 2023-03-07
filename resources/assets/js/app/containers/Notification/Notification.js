import { Layout, Col, Row, Typography } from 'antd';
import React from 'react';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import styled from 'styled-components';
import './NotificationList.css';
import { MessageOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Text, Link } = Typography;

const NotificationWrapper = styled(LayoutWrapper)`
  .isoComponentTitle {
    margin-bottom: 0px;
    @media only screen and (max-width: 991px) {
      margin-bottom: 10px;
    }
  }

  .Notification-title {
    @media (max-width: 768px) {
      display: none;
    }
  }
  .notification-title-ext {
    @media (min-width: 768px) {
      display: none;
    }
  }
  .page-header-wrapper {
    margin-bottom: 20px;
    width: 100%;
  }

  .remaining-credits {
    margin-bottom: 1rem;
  }

  .column-title {
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 16px 5px;
    }
  }

  .phone-number-column {
    white-space: nowrap;
    @media (max-width: 768px) {
      padding: 16px 5px !important;
    }
  }
  .header {
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .actions-column {
    width: 105px;
    min-width: 105px;
    max-width: 105px;
    text-align: center;
  }

  .self-join-desktop {
    @media only screen and (max-width: 991px) {
      display: none;
    }
  }

  .self-join-mobile {
    margin-left: 10px;
    @media only screen and (min-width: 768px) {
      margin-left: 16px;
    }
    @media only screen and (min-width: 992px) {
      display: none;
    }
  }
`;

// export const responsiveFormItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 4 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16, offset: 4 },
//     md: { span: 10, offset: 7 },
//     lg: { span: 6, offset: 8 },
//   },
// };

function NotificationList() {
  return (
    // <NotificationWrapper>
    //   <div className="page-header-wrapper">
    //     <div className="notification-title-ext">
    //       {' '}
    //       <PageHeader>
    //         <span className="title guest-title-ext">Notification</span>+{' '}
    //       </PageHeader>{' '}
    //     </div>
    //   </div>
    //   <Content>
    <div className="notification-wrapper">
      <Row>
        <Col
          //   {...responsiveFormItemLayout.wrapperCol}
          className="white-wrapper border-bottom padding-10">
          <div className="d-flex">
            <MessageOutlined className="pr-10 icon" />
            <div className="d-flex-col">
              <Text>
                Your message <b>'sdfdfdfds dfsdfsdfsd dd fsd fs ...'</b> has
                sent to <b>'All Group, Text Group, and normal Group'.</b>
              </Text>
              <span className="text-muted">20 minutes ago</span>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          //   {...responsiveFormItemLayout.wrapperCol}
          className="white-wrapper border-bottom padding-10">
          <div className="d-flex">
            <MessageOutlined className="pr-10 icon" />
            <div className="d-flex-col">
              <Text>
                Your message <b>'sdfdfdfds dfsdfsdfsd dd fsd fs ...'</b> has
                sent to <b>'All Group, Text Group, and normal Group'.</b>
              </Text>
              <span className="text-muted">20 minutes ago</span>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          //   {...responsiveFormItemLayout.wrapperCol}
          className="white-wrapper border-bottom padding-10">
          <div className="d-flex">
            <MessageOutlined className="pr-10 icon" />
            <div className="d-flex-col">
              <Text>
                Your message <b>'sdfdfdfds dfsdfsdfsd dd fsd fs ...'</b> has
                sent to <b>'All Group, Text Group, and normal Group'.</b>
              </Text>
              <span className="text-muted">20 minutes ago</span>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          //   {...responsiveFormItemLayout.wrapperCol}
          className="white-wrapper border-bottom padding-10">
          <div className="d-flex">
            <MessageOutlined className="pr-10 icon" />
            <div className="d-flex-col">
              <Text>
                Your message <b>'sdfdfdfds dfsdfsdfsd dd fsd fs ...'</b> has
                sent to <b>'All Group, Text Group, and normal Group'.</b>
              </Text>
              <span className="text-muted">20 minutes ago</span>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          //   {...responsiveFormItemLayout.wrapperCol}
          className="white-wrapper padding-10">
          <div className="d-flex">
            <MessageOutlined className="pr-10 icon" />
            <div className="d-flex-col">
              <Text>
                Your message <b>'sdfdfdfds dfsdfsdfsd dd fsd fs ...'</b> has
                sent to <b>'All Group, Text Group, and normal Group'.</b>
              </Text>
              <span className="text-muted">20 minutes ago</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    //   </Content>
    // </NotificationWrapper>
  );
}

export default NotificationList;
