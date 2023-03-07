import { Layout, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import styled from 'styled-components';
import './NotificationList.css';
import { MessageOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import store from '../../redux/store';
const { Content } = Layout;
const { Text } = Typography;
import Moment from 'moment';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

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

function NotificationList(props) {
  const [notifications, setNotifications] = useState([]);
  const loadMoreData = url => {
    if (props.next_page) {
      // console.log('next page', url);
      props.loadMore(url);
    }
  };
  useEffect(() => {
    props.loadNotifications();
  }, []);

  useEffect(
    () => {
      if (props.notifications) {
        setNotifications(props.notifications);
        // console.log('updated', props.notifications);
        // console.log(props);
      }
    },
    [props.notifications]
  );

  // useEffect(
  //   () => {
  //     // console.log(notifications);
  //     if (notifications && notifications.length > 0) {
  //       notifications.map(notify => {
  //         console.log(notify.data);
  //       });
  //     }
  //   },
  //   [notifications]
  // );

  return (
    <div className="notification-wrapper">
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMoreData(props.next_page_url)}
        hasMore={props.next_page}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }>
        {notifications && notifications.length > 0
          ? notifications.map(notify => {
              // console.log('notify', notify);
              if (notify && notify.data) {
                return (
                  <Row className="row" key={notify.id}>
                    <Link
                      to={
                        notify.data.notify_type == 'message_scheduled' ||
                        notify.data.notify_type == 'message_sent'
                          ? '/dashboard/messages'
                          : notify.data.notify_type == 'event_created'
                            ? '/dashboard/event-settings'
                            : notify.data.notify_type == 'payment_done'
                              ? '/dashboard/invoices'
                              : notify.data.notify_type == 'group_created'
                                ? '/dashboard/groups'
                                : '/dashboard'
                      }>
                      <Col
                        //   {...responsiveFormItemLayout.wrapperCol}
                        className="white-wrapper border-bottom padding-10">
                        <div className="d-flex">
                          <MessageOutlined className="pr-10 icon" />
                          <div className="d-flex-col">
                            <Text>{notify.data.message}</Text>
                            <span className="text-muted">
                              {Moment.utc(notify.created_at).fromNow()}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Link>
                  </Row>
                );
              }
            })
          : 'No Notification'}
      </InfiniteScroll>
    </div>
  );
}

export default connect(
  state => ({
    notifications: store.select.Test.allNotifications(state),
    next_page: state.Test.next_page,
    next_page_url: state.Test.next_page_url,
  }),
  ({ Test: { loadNotifications, loadMore } }) => ({
    loadNotifications,
    loadMore,
  })
)(NotificationList);
