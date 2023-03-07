import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import axios from 'axios';
import Spin from '../../app/components/feedback/spin';
import MessageNotFound from './MessageNotFound';
import { RouteComponentProps } from 'react-router-dom';
import Moment from 'moment';
import Reply from '../../app/containers/ReplyStream/Reply';
import Button from '../../app/components/uielements/button';

const CenteredRow = styled(Row)`
  display: flex !important;
  justify-content: center !important;
`;

interface Props
  extends RouteComponentProps<{
    id: string,
    replyId?: string,
    messageId: string,
  }> {}

class PublicStream extends React.Component<Props> {
  state = {
    isLoading: true,
    message: null,
  };

  async componentDidMount() {
    const { replyId, messageId } = this.props.match.params;

    if (replyId || messageId) {
      this.loadMessage(replyId, messageId);
    } else {
      this.setState({ isLoading: false });
    }
  }

  loadMessage = async (replyId, messageId) => {
    try {
      // Get reply or message from API
      const path = replyId
        ? `/api/replies/${replyId}/public`
        : `/api/messages/${messageId}/public`;

      const res = await axios.get(path);
      if (
        res.status !== 200 ||
        res.data.status !== 'success' ||
        !res.data.data
      ) {
        throw Error('There was a problem retrieving the message');
      }

      // Format dates with Moment.js
      const message = {
        ...res.data.data,
        received_at: Moment(res.data.data.received_at),
      };
      this.setState({ isLoading: false, message });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, message } = this.state;
    const { id } = this.props.match.params;

    if (isLoading) {
      return (
        <CenteredRow>
          <Col>
            <Spin tip="Loading message..." />
          </Col>
        </CenteredRow>
      );
    }

    return (
      <CenteredRow>
        <Col xs={22} md={18} lg={12}>
          <div style={{ marginBottom: '2rem' }}>
            <a href={`/${id}`}>
              <Button type="primary">
                <i
                  className="ion-arrow-left-c"
                  style={{ marginRight: '0.65rem' }}
                />
                Back to Reply Stream
              </Button>
            </a>
          </div>
          {message ? (
            <Reply eventId={id} reply={message} isPublicStream={true} />
          ) : (
            <MessageNotFound />
          )}
        </Col>
      </CenteredRow>
    );
  }
}

export default PublicStream;
