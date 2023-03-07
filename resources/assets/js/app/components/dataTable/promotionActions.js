import React from 'react';
import { Button, Popconfirm } from 'antd';
import ActionsWrapper from './actions.style';
import api from '../../services/api';
import { connect } from 'react-redux';
import store from '../../redux/store';

type Props = {
  eventId: string,
  optOutPromotion: ({
    eventId: string,
    token: string,
    price: number,
  }) => void,
};

const PromotionActions: React.FC = (props: Props) => {
  const handlePayment = (token, price) => {
    props.optOutPromotion({
      eventId: props.eventId,
      token: token.id,
      price,
      promotion: 'share50',
    });
  };

  return (
    <ActionsWrapper>
      <li>
        <Popconfirm
          title={
            <div style={{ maxWidth: '250px' }}>
              To opt out of this promotional message, you must pay back the $50
              discount you had on your activation.
              <div style={{ fontWeight: 900, marginTop: '1rem' }}>
                Do you want to pay $50 and remove this message?
              </div>
            </div>
          }
          onConfirm={() => optOutPromotion(handlePayment)}
          okText="Yes"
          cancelText="No"
          placement="topRight">
          <Button icon="delete" type="danger" />
        </Popconfirm>
      </li>
    </ActionsWrapper>
  );
};

const optOutPromotion = async handlePayment => {
  const priceToPay = 50; // $50
  // Wiring up Stripe

  const user = await api.me();

  const handler = window.StripeCheckout.configure({
    key: window.stripeApi, // see index.blade.php in resources/views
    image: '/assets/images/live/tmg_logo_stripe.png',
    locale: 'auto',
    email: user ? user.email : undefined,
    allowRememberMe: false,
  });
  if (handler) {
    handler.open({
      name: 'TextMyGuests',
      amount: parseInt(priceToPay * 100), // In cents
      panelLabel: `Pay `,
      token: token => handlePayment(token, priceToPay),
    });
  }
};

export default connect(
  state => ({
    user: store.select.Auth.user(state),
  }),
  ({ Message: { optOutPromotion } }) => ({
    optOutPromotion,
  })
)(PromotionActions);
