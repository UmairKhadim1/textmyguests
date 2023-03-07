import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import AppHolder from '../../app/containers/App/commonStyle';
import themes from '../../app/config/themes';
import { Layout, Row, Col } from 'antd';
import { siteConfig } from '../../app/config';
import axios from 'axios';
// import Moment from 'moment';
import Spin from '../../app/components/feedback/spin';
// import EventNotFound from './EventNotFound';
import Topbar from '../replyStream/Topbar';
import SelfJoinDescription from './SelfJoinDescription';
import SelfJoinForm from './SelfJoinForm';
import notification from '../../app/components/feedback/notification';
import SelfJoinConfirmation from './SelfJoinConfirmation';

const { Content, Footer } = Layout;

const CenteredRow = styled(Row)`
  display: flex !important;
  justify-content: center !important;
`;

const SelfJoin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(event);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      // Get event info from API
      const res = await axios.get(`/api/events/${id}/public`);
      if (
        res.status !== 200 ||
        res.data.status !== 'success' ||
        !res.data.data
      ) {
        throw Error('There was a problem retrieving the event');
      }

      setEvent(res.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSubmit = async values => {
    setSubmittingForm(true);

    try {
      const res = await axios.post(`/api/events/${id}/guests/self`, {
        first_name: values.firstname,
        last_name: values.lastname,
        phone: values.phone,
        country: 'us',
      });

      if (
        res.status !== 200 ||
        res.data.status !== 'success' ||
        !res.data.data
      ) {
        throw Error('There was a problem adding you to the event');
      }

      setIsSaved(true);
      setSubmittingForm(false);
    } catch (error) {
      const err = error.response;
      let errorMessage =
        error.message ||
        'Sorry, an error occured while trying to save your information.';
      if (err && err.data && err.data.message) {
        errorMessage = err.data.message;
      }
      notification.error({ message: errorMessage });
      setSubmittingForm(false);
    }
  };

  let view = (
    <CenteredRow>
      <Col>
        <Spin />
      </Col>
    </CenteredRow>
  );

  if (!isLoading) {
    view = (
      <CenteredRow>
        <Col xs={22} md={18} lg={10} xl={9}>
          {isSaved ? (
            <SelfJoinConfirmation event={event} />
          ) : (
            <>
              <SelfJoinDescription event={event} />
              <SelfJoinForm
                handleSubmit={handleSubmit}
                submitting={submittingForm}
              />
            </>
          )}
        </Col>
      </CenteredRow>
    );
  }

  return (
    <ThemeProvider theme={themes.themedefault}>
      <AppHolder>
        <Layout style={{ minHeight: '100vh', height: '100px' }}>
          {/* Topbar */}
          <Topbar />
          <Layout className="isoContentMainLayout">
            <Content
              className="isomorphicContent"
              style={{
                padding: '90px 0px 0px',
                flexShrink: '0',
                background: '#f1f3f6',
              }}>
              {view}
            </Content>
            <Footer
              style={{
                background: '#ffffff',
                textAlign: 'center',
                borderTop: '1px solid #ededed',
              }}>
              {siteConfig.footerText}
            </Footer>
          </Layout>
        </Layout>
      </AppHolder>
    </ThemeProvider>
  );
};

export default SelfJoin;
