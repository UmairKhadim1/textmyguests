// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import {
  ActivationAlert,
  UpgradeAlert,
} from '../../components/feedback/ActivationAlert';
import DataViewWrapper from './dataView.style';
import type { Event, DashboardData, ID } from '../../type';
import * as actions from '../../redux/dashboard/actions';
import { getSelectedEvent } from '../../redux/events/reducer';
import { getEventDashboard } from '../../redux/dashboard/reducer';
import { createLoadingSelector } from '../../redux/loading/reducer';

type DataViewProps = {
  event: Event,
  data: DashboardData,
};

const DataView = (props: DataViewProps) => {
  const { event, data } = props;
  const { counts } = data;
  let alert = null;
  if (event.payment) {
    alert = event.payment.activated ? <UpgradeAlert /> : <ActivationAlert />;
  }
  return (
    <DataViewWrapper>
      <PageHeader>
        <span className="title">Dashboard</span>
      </PageHeader>
      {alert}
      <Row gutter={16} style={{ width: '100%' }}>
        <Col xs={24} md={8}>
          <div className="count-box" style={{ backgroundColor: '#0096d1' }}>
            <h3 className="count">{counts.messages}</h3>
            <p className="item-type">{`Message${
              counts.messages > 1 ? 's' : ''
            }`}</p>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="count-box" style={{ backgroundColor: '#e73b03' }}>
            <h3 className="count">{counts.guests}</h3>
            <p className="item-type">{`Guest${
              counts.guests > 1 ? 's' : ''
            }`}</p>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="count-box" style={{ backgroundColor: '#9e178e' }}>
            <h3 className="count">{counts.groups}</h3>
            <p className="item-type">{`Group${
              counts.groups > 1 ? 's' : ''
            }`}</p>
          </div>
        </Col>
      </Row>
    </DataViewWrapper>
  );
};

type DashboardProps = {
  event: Event | null,
  data: DashboardData,
  history: Object,
  loading: boolean,
  fetchDashboard: (eventId: ID) => void,
};

class Dashboard extends React.Component<DashboardProps> {
  goToNewEvent = () => {
    const { history } = this.props;
    history.push('/app/dashboard/new-event');
  };

  render() {
    const { event, loading } = this.props;
    return (
      <div>
        <LayoutWrapper />
      </div>
    );
  }
}

const loadingSelector = createLoadingSelector([
  'FETCH_EVENT',
  'FETCH_DASHBOARD',
]);

export default connect(
  state => ({
    data: getEventDashboard(state),
    event: getSelectedEvent(state),
    loading: loadingSelector(state),
  }),
  {
    fetchDashboard: actions.fetchDashboard,
  }
)(Dashboard);
