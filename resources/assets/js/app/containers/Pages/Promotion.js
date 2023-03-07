import React from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import { Layout, Row, Col, Button } from 'antd';
import PromotionContainer from './Promotion.style';
import styled from 'styled-components';
import { Link, History } from 'react-router-dom';
import { isEventActivated } from '../../helpers/functions';

import OptInPromotion from './OptInPromotion';
const { Content } = Layout;

export const ReplyWrapper = styled.div`
  margin-bottom: 24px;

  .body {
    background: ${props =>
      props.isFromHost
        ? 'linear-gradient( 40deg, rgb(247,56,97) 25%, rgb(254,114,78) 100%)'
        : '#fff'};
    color: ${props => (props.isFromHost ? '#e3e3e3' : 'inherit')};
    border-radius: 4px;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 275px;
  overflow: hidden;
  position: relative;

  img {
    max-width: 100%;
  }

  .fade {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
      to bottom,
      rgba(241, 243, 246, 0) 55%,
      rgba(241, 243, 246, 1) 102%
    );
  }
`;

type Props = {
  event: any,
  optInPromotion: ({ promotion: string, amount: number }) => void,
  loadingOptIn: boolean,
  history: History,
};

const Promotion: React.FC = (props: Props) => (
  <LayoutWrapper style={{ padding: '30px 20px 0px' }}>
    <Content>
      <PromotionContainer>
        <Row type="flex" justify="center">
          <Col xs={24} md={20} lg={15} xl={14}>
            <h1 className="title">Get $50 Off!</h1>
            <p className="explanation">
              Let your guests know you used TextMyGuests.com for your event, and
              we will give you $50! Opt-in, and we will send a single, short
              message after the conclusion of your event. This message will be
              sent only once, and you can review it before it’s sent.
            </p>

            {/* If the event is activated, render a pop confirm
                to ask the user if he/she wants to proceed to the refund.
                
                If the event is not activated yet, render a link to the
                activation page with the promotion already checked.
              */}
            {isEventActivated(props.event) ? (
              <OptInPromotion {...props} />
            ) : (
              <Link
                to={{
                  pathname: '/dashboard/activate',
                  state: { activatePromotion: true },
                }}>
                <Button type="primary" className="cta-button">
                  Get $50 off now
                </Button>
              </Link>
            )}

            <div className="questions-container">
              <h4>When will this message be sent?</h4>
              <p>At 11:00 AM the day after your last message.</p>
              <h4>
                Can I opt out after activating my event if I change my mind?
              </h4>
              <p>Yes.</p>
              <h4>Can I opt in after activating my event?</h4>
              <p>Yes.</p>
            </div>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col xs={24} md={16} lg={12} xl={7}>
            <ImageWrapper>
              <span className="fade" />
              <img src="/images/TMG_Promotion_demo.png" />
            </ImageWrapper>
          </Col>
        </Row>
      </PromotionContainer>
    </Content>
  </LayoutWrapper>
);

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    loadingOptIn: state.loading.effects.Message.optInPromotion,
  }),
  ({ Message: { optInPromotion } }) => ({
    optInPromotion,
  })
)(Promotion);
