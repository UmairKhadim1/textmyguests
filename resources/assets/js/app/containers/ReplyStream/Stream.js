import React from 'react';
import DaySeparator from './DaySeparator';
import { Col, Row } from 'antd';
import Reply from './Reply';
import styled from 'styled-components';

const CenteredRow = styled(Row)`
  display: flex !important;
  justify-content: center !important;
`;

type Props = {
  eventId: string,
  isPublicStream: boolean,
  repliesByDay: any,
  toggleHidden: ({
    eventId: string,
    type: string,
    id: number,
    hidden: boolean,
  }) => void,
};

const Stream = (props: Props) => {
  const { repliesByDay } = props;
  const days = Object.keys(repliesByDay);

  return (
    <CenteredRow>
      <Col xs={22} md={18} lg={12}>
        {days.map(day => (
          <div key={day}>
            <DaySeparator day={day} />
            {Object.values(repliesByDay[day]).map(reply => (
              <Reply
                key={reply.type + '_' + reply.id}
                eventId={props.eventId}
                reply={reply}
                toggleHidden={props.toggleHidden}
                isPublicStream={props.isPublicStream}
              />
            ))}
          </div>
        ))}
      </Col>
    </CenteredRow>
  );
};

export default Stream;
