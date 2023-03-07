import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import Alert from '../../components/feedback/alert';
import type TMoment from 'moment';
import { isEventActivated } from '../../helpers/functions';
import Promo from './Promo';

const PaymentContainer = styled.div`
  background: #ffffff;
  padding: 1rem 1.5rem;

  .title {
    margin-bottom: 1rem;
  }

  .info-message {
    color: ${({ theme }) => theme.palette.primary[0]};
    font-size: 13px;
  }

  @media only screen and (min-width: 992px) {
    width: 400px
    min-width: 300px;
    /* flex-shrink: 0; */
  }
`;

const FlexContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;

  .expand {
    flex-grow: 1;
  }

  .amount {
    align-self: flex-end;
    font-weight: 600;
  }

  .item {
    font-weight: 600;
  }
  .pink {
    color: ${({ theme }) => theme.palette.color[2]};
  }
  .item .discount_label {
    font-size: 17px;
  }

  &.subtotal {
    font-size: 16px;
    margin: 0rem 0rem 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.25);
  }

  &.total {
    font-size: 20px;
    margin: 1rem 0rem 1.25rem;
  }
`;

const FlexColumn = styled.div`
  flex-grow: 1;
  @media only screen and (min-width: 992px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

type Props = {
  event: any,
  eventDate: TMoment,
  onBuy: (token: { id: string }, planId: string) => void,
  processingPayment: boolean,
  loadingUser: boolean,
  guestLimit: number,
  user: any,
  promotion: string | null,
  setShowDateErrorMessage(value: boolean): void,
  showDateErrorMessage: boolean,
};

const Payment = (props: Props) => {
  // var totalPrice = 149.0;
  const { event } = props;
  const alreadyActivated = isEventActivated(event);
  // console.log(event);

  // Caculate total price with discount and promotions
  const initialPrice = 149; // 149$
  const { discount, discountOwner } = event.payment;
  const [promoId, setPromoId] = useState(0);
  const priceAfterDiscount = initialPrice * ((100 - discount) / 100);
  let finalPrice =
    props.promotion === 'share50'
      ? priceAfterDiscount - 50
      : priceAfterDiscount;

  const [discountPrice, setDiscountPrice] = useState(0.0);

  // We cannot process payments smaller than 1$
  let priceIsTooSmall = null;
  if (finalPrice < 1) {
    finalPrice = 1;
    priceIsTooSmall = 'We cannot process payments smaller than $1.00.';
  }
  const updateTotalPrice = (type, value, id) => {
    if (type === 'fixed') {
      if (value >= initialPrice) {
        setDiscountPrice(initialPrice);
      } else {
        setDiscountPrice(value);
        // discount_price = value;
        // totalPrice = finalPrice - value;
      }
    } else {
      setDiscountPrice((initialPrice * value) / 100);
      // totalPrice = finalPrice - (finalPrice * value) /100 ;
    }
    // console.log(totalPrice);

    setPromoId(id);
  };
  const [totalPrice, setTotalPrice] = useState(finalPrice);
  useEffect(() => {
    discountPrice >= finalPrice
      ? setTotalPrice(1.0)
      : setTotalPrice(finalPrice - discountPrice);
  });

  props.setTotalPrice(totalPrice);
  props.setPromoId(promoId);

  // Contact us for events with more than 500 guests
  const isOverLimit = event.payment.spentCredits > props.guestLimit;

  // Wiring up Stripe
  const [handler, setHandler] = useState();
  const { user } = props;
  useEffect(
    () => {
      const handler = window.StripeCheckout.configure({
        key: window.stripeApi, // see index.blade.php in resources/views
        image: '/assets/images/live/tmg_logo_stripe.png',
        locale: 'auto',
        email: user ? user.email : undefined,
        allowRememberMe: false,
      });
      setHandler(handler);
    },
    [user]
  );

  const handlePay = (): void => {
    if (!props.eventDate) {
      props.setShowDateErrorMessage(true);
      return;
    }

    if (handler) {
      handler.open({
        name: 'TextMyGuests',
        amount: parseInt(totalPrice * 100), // In cents
        panelLabel: `Pay `,
        token: token => {
          if (props.onBuy)
            props.onBuy(token, Math.round(totalPrice * 100) / 100);
        },
      });
    }
  };

  return (
    <PaymentContainer>
      <h2 className="title">Payment</h2>
      <FlexColumn>
        <div>
          <FlexContainer>
            <div className="expand">
              <span className="item pink">UNLIMITED GUESTS</span>
            </div>
            <div className="amount">${initialPrice.toFixed(2)}</div>
          </FlexContainer>

          {discount > 0 && (
            <FlexContainer>
              <div className="expand item">
                <span className="label pink">DISCOUNT</span>
                <br />
                <span>
                  ({discountOwner}: -{discount}
                  %)
                </span>
              </div>
              <div className="amount">
                - ${(initialPrice - priceAfterDiscount).toFixed(2)}
              </div>
            </FlexContainer>
          )}

          {props.promotion &&
            discount > 0 && (
              <FlexContainer className="subtotal">
                <div className="expand item">
                  <span className="label">Subtotal</span>
                </div>
                <div className="amount">${priceAfterDiscount.toFixed(2)}</div>
              </FlexContainer>
            )}

          {props.promotion && (
            <FlexContainer
              style={{ marginBottom: discount > 0 ? '0.75rem' : '1.25rem' }}>
              <div className="expand item">
                <span className="label pink">PROMOTIONS</span>
                <br />
                <span>Promotional message</span>
              </div>
              <div className="amount">- $50.00</div>
            </FlexContainer>
          )}
        </div>

        {priceIsTooSmall && (
          <div className="info-message">
            <i
              className="ion-alert-circled"
              style={{ marginRight: '0.5rem' }}
            />
            {priceIsTooSmall}
          </div>
        )}

        <div>
          <FlexContainer className="total">
            <div className="expand item">
              <span className="label">Total</span>
            </div>
            <div className="amount">
              {finalPrice ? `$${finalPrice.toFixed(2)}` : '-'}
            </div>
          </FlexContainer>

          <FlexContainer>
            <Promo
              event={event}
              getPromodata={updateTotalPrice}
              checkActivation={
                !finalPrice ||
                alreadyActivated ||
                isOverLimit ||
                props.processingPayment ||
                props.loadingUser
              }
            />
          </FlexContainer>
          <FlexContainer className="total">
            <div className="expand item">
              <span className="discount_label">Discount </span>
            </div>
            <div className="amount">
              {`$${(finalPrice - totalPrice).toFixed(2)}`}
            </div>
          </FlexContainer>
          <FlexContainer className="total">
            <div className="expand item">
              <span className="label">Final Price</span>
            </div>
            <div className="amount">
              {totalPrice ? `$${totalPrice.toFixed(2)}` : '-'}
            </div>
          </FlexContainer>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              disabled={
                !finalPrice ||
                alreadyActivated ||
                isOverLimit ||
                props.processingPayment ||
                props.loadingUser
              }
              loading={props.processingPayment}
              onClick={handlePay}>
              {alreadyActivated
                ? 'Event activated'
                : isOverLimit
                  ? 'Please contact us'
                  : props.loadingUser
                    ? 'Loading user...'
                    : props.processingPayment
                      ? 'Activating event'
                      : `Activate event for $${totalPrice.toFixed(2)}`}
            </Button>
          </div>

          {props.showDateErrorMessage && (
            <Alert
              style={{ marginTop: '1rem' }}
              message="You need to set the date of your event before activating."
              type="error"
              showIcon
            />
          )}
        </div>
      </FlexColumn>
    </PaymentContainer>
  );
};

export default Payment;
