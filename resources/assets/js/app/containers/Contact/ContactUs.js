import React, { useState } from 'react';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import { Layout } from 'antd';
import PageHeader from '../../components/utility/pageHeader';
import ContactForm from './ContactForm';
import api from '../../services/api';
import notification from '../../components/feedback/notification';

const { Content } = Layout;

const ContactUs: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const sendMessage = async (subject: string, message: string) => {
    try {
      setIsSending(true);
      const res = await api.sendContactMessage(subject, message);
      if (res.status !== 200 || res.data.status !== 'success') {
        throw Error();
      }
      setIsSending(false);
      setMessageSent(true);
    } catch (e) {
      setIsSending(false);
      notification.error({
        message: 'There was an error sending your message',
      });
    }
  };

  return (
    <LayoutWrapper>
      <PageHeader>
        <span className="title">Contact us</span>
      </PageHeader>
      <Content>
        {messageSent ? (
          <div>
            <p style={{ marginBottom: '5px' }}>
              Your message was successfully sent to our support!
            </p>
            <p>
              We will get back to you as fast as we can. Our reply will be sent
              directly to your email address.
            </p>
          </div>
        ) : (
          <ContactForm loading={isSending} sendMessage={sendMessage} />
        )}
      </Content>
    </LayoutWrapper>
  );
};

export default ContactUs;
