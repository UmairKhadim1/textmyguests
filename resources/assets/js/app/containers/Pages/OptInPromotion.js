import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Spin, notification } from 'antd';
import api from '../../services/api';

type Props = {
  event: any,
  optInPromotion: ({ promotion: string, amount: number }) => void,
  loadingOptIn: boolean,
  history: History,
};

const OptInPromotion: React.FC = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingCardInfo, setLoadingCardInfo] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const getInvoiceForRefund = async (eventId: string) => {
    setLoadingCardInfo(true);
    try {
      const invoiceFromApi = invoice
        ? null
        : await api.getInvoiceForRefund(eventId, 50);
      setInvoice(invoiceFromApi || invoice);
    } catch (e) {
      notification.error({
        message:
          'Sorry, an error occured while applying the promotion. Please contact us.',
      });
    }
    setLoadingCardInfo(false);
  };

  const openModal = () => {
    getInvoiceForRefund(props.event.id);
    setShowModal(true);
  };

  return (
    <div>
      <Button type="primary" className="cta-button" onClick={openModal}>
        Get $50 off now
      </Button>
      <Modal
        title="$50 off promotion"
        visible={showModal}
        onOk={() =>
          props.optInPromotion({
            eventId: props.event.id,
            promotion: 'share50',
            refund: 50,
            invoiceId: invoice ? invoice.id : null,
            cb: () => props.history.push('/dashboard/messages'),
          })
        }
        onCancel={() => setShowModal(false)}
        confirmLoading={props.loadingOptIn}
        okText="Yes, get $50 off"
        cancelText="Cancel"
        footer={loadingCardInfo || !invoice ? null : undefined}>
        {loadingCardInfo ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" tip="Loading payment data..." />
          </div>
        ) : invoice ? (
          <div style={{ fontSize: '15px' }}>
            <p style={{ marginBottom: '1rem' }}>
              We will add a promotional message that will be sent at the
              conclusion of your event and refund $50 to the following credit
              card:
            </p>
            <div
              style={{
                marginBottom: '1rem',
                display: 'inline-block',
                fontWeight: 900,
              }}>
              <span style={{ textTransform: 'uppercase' }}>
                {invoice.card_type}
              </span>{' '}
              **** **** **** {invoice.card_last4}
            </div>
            <div>Do you want to proceed?</div>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1rem' }}>
              Sorry, we could not find any invoice to refund you. This can occur
              if another owner paid for the activation of the event.
            </p>
            <p>
              If you think this is an error, please{' '}
              <Link to="/dashboard/contact">contact us</Link>.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OptInPromotion;
