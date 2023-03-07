import React from 'react';
import Stream from '../../app/containers/ReplyStream/Stream';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import axios from 'axios';
import Moment from 'moment';
import Spin from '../../app/components/feedback/spin';
import EventNotFound from './EventNotFound';
import EmptyStream from './EmptyStream';
import { RouteComponentProps } from 'react-router-dom';
import Button from '../../app/components/uielements/button';

const CenteredRow = styled(Row)`
  display: flex !important;
  justify-content: center !important;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  .ant-btn {
    font-size: 16px;
  }
`;

interface Props extends RouteComponentProps<{ id: string }> {}

class PublicStream extends React.Component<Props> {
  state = {
    isLoading: true,
    repliesByDay: null,
    showJoinButton: false,
  };

  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      this.loadReplies(id);
    } else {
      this.setState({ isLoading: false });
    }
  }

  loadReplies = async id => {
    try {
      // Get replies from API
      const res = await axios.get(`/api/events/${id}/public-reply-stream`);
      if (
        res.status !== 200 ||
        res.data.status !== 'success' ||
        !res.data.data
      ) {
        throw Error('There was a problem retrieving the event');
      }

      // Format dates with Moment.js
      const replies = res.data.data.replies.map(reply => {
        if (reply.received_at) reply.received_at = Moment(reply.received_at);
        return reply;
      });

      // Organize replies by day
      const repliesByDay = Object.values(replies)
        .sort()
        .reduce((acc, reply) => {
          const day = reply.received_at.format('MM/DD/YYYY');
          if (!acc[day]) acc[day] = [];
          acc[day].push(reply);
          return acc;
        }, {});

      this.setState({
        isLoading: false,
        id,
        repliesByDay,
        showJoinButton: !!res.data.data.showJoinButton,
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { id } = this.props.match.params;
    const { isLoading, repliesByDay } = this.state;

    if (isLoading) {
      return (
        <CenteredRow>
          <Col>
            <Spin tip="Loading reply stream..." />
          </Col>
        </CenteredRow>
      );
    }

    return repliesByDay ? (
      Object.keys(repliesByDay).length > 0 ? (
        <div>
          {this.state.showJoinButton && (
            <CenteredRow>
              <Col xs={22} md={18} lg={12}>
                <ButtonWrapper>
                  <a href={`/${id}/join`}>
                    <Button type="primary" size="large">
                      Join this event!
                    </Button>
                  </a>
                </ButtonWrapper>
              </Col>
            </CenteredRow>
          )}
          <Stream
            eventId={id}
            repliesByDay={repliesByDay}
            isPublicStream={true}
          />
        </div>
      ) : (
        <EmptyStream />
      )
    ) : (
      <EventNotFound />
    );
  }
}

export default PublicStream;
