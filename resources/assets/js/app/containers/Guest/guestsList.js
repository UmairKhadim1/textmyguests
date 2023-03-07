// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Layout, Table, Tag, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import Actions from '../../components/dataTable/actions';
import store from '../../redux/store';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import GuestLimitAlert from '../../components/feedback/GuestLimitAlert';
import SelfJoinUrl from './SelfJoinUrl';
import OptList from './OptList';

const { Column } = Table;
const { Content } = Layout;

const GuestWrapper = styled(LayoutWrapper)`
  .isoComponentTitle {
    margin-bottom: 0px;
    @media only screen and (max-width: 991px) {
      margin-bottom: 10px;
    }
  }

  .guest-title {
    @media (max-width: 768px) {
      display: none;
    }
  }
  .guest-title-ext {
    @media (min-width: 768px) {
      display: none;
    }
  }
  .page-header-wrapper {
    margin-bottom: 20px;
    width: 100%;
  }

  .remaining-credits {
    margin-bottom: 1rem;
  }

  .column-title {
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 16px 5px;
    }
  }

  .phone-number-column {
    white-space: nowrap;
    @media (max-width: 768px) {
      padding: 16px 5px !important;
    }
  }
  .header {
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .actions-column {
    width: 105px;
    min-width: 105px;
    max-width: 105px;
    text-align: center;
  }

  .self-join-desktop {
    @media only screen and (max-width: 991px) {
      display: none;
    }
  }

  .self-join-mobile {
    margin-left: 10px;
    @media only screen and (min-width: 768px) {
      margin-left: 16px;
    }
    @media only screen and (min-width: 992px) {
      display: none;
    }
  }
`;

const GuestList = (props: {
  event?: Object,
  guests: Array<Object>,
  loading: boolean,
  deleting: boolean,
  loadGuests: (eventId: string) => void,
  deleteGuest: ({ eventId: string, guestId: string, cb?: Function }) => void,
  history: Object,
  match: Object,
}) => {
  useEffect(
    () => {
      const { event, loadGuests } = props;
      if (event) loadGuests(event.id);
    },
    [(props.event || {}).id]
  );
  const [visible, setVisible] = useState(false);
  const { event, match } = props;
  const { url } = match;

  // Check if guest limit is exceeded
  const guestLimitExceeded =
    event &&
    event.payment &&
    event.payment.activated &&
    event.payment.remainingCredits < 0;

  // Ordering guests
  // First, we place undefined/null phone numbers at the top of the list
  // Then, we place guests in alphabetical orders by their last_name
  const orderedGuests = _.orderBy(
    props.guests,
    [guest => (guest.phone ? 2 : 1), 'last_name'],
    ['asc', 'asc']
  );

  useEffect(() => {
    console.log(props.guests)
  }, [props.guests])
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
// const[user,setUser] = ("")
// const handlerUser = ()=> {
//   setUser();
// }
  return (
    <div>
      <GuestWrapper>
        <div className="page-header-wrapper">
          <div className="guest-title-ext">
            {' '}
            <PageHeader>
              <span className="title guest-title-ext">Guests</span>+{' '}
            </PageHeader>{' '}
          </div>
          <PageHeader>
            <span className="title guest-title">Guests</span>
            <Link to={`${url}/edit/`} style={{ marginRight: '20px' }}>
              <Button icon="plus" type="primary">
                New guest
              </Button>
            </Link>
            <Link to={`${url}/bulk-upload`} style={{ marginRight: '16px' }}>
              <Button icon="upload" className="mt-5">
                Bulk Upload Guests
              </Button>
            </Link>
            <div className="self-join-desktop">
              <SelfJoinUrl eventId={event.id} />
            </div>
            {/* <div className="self-join-desktop" style={{ marginLeft: '10px' }}>
              <Button type="primary" onClick={showModal}>
                Opt Out guests
              </Button>
            </div> */}
          </PageHeader>
          <div className="self-join-mobile">
            <SelfJoinUrl eventId={event.id} />
          </div>
          {/* <div className="self-join-mobile">
            <Button type="primary" onClick={showModal}>
              Opt Out guests
            </Button>
          </div> */}
        </div>
        <Content style={{ overflow: 'auto' }}>
          {guestLimitExceeded && (
            <div style={{ marginTop: '12px' }}>
              <GuestLimitAlert />
            </div>
          )}
          <Modal
            title="Opt out guest list"
            visible={visible}
            onCancel={hideModal}
            okButtonProps={{ style: { display: 'none' } }}>
            <OptList guests={props.guests} />
          </Modal>
          <Table
            loading={props.loading}
            rowKey={guest => guest.id}
            dataSource={orderedGuests}
            style={{ marginTop: '24px' }}
            scroll={{ x: 'auto' }}>
            <Column
              title={<span className="column-title">Name</span>}
              key="name"
              render={guest => (
                <span>{`${guest.last_name}${guest.last_name ? ', ' : ''}${
                  guest.first_name
                }`}</span>
              )}
            />
            <Column
              title={<span className="column-title">Country</span>}
              dataIndex="phone"
              key="phone"
              render={phone => {
                let formatted = 'No Country Set';
                if (phone) {
                  const phoneNumber = parsePhoneNumberFromString(phone);
                  if (phoneNumber) {
                    // console.log('phone number', phoneNumber.country);
                    if (phoneNumber.country === 'US') {
                      formatted = 'United State';
                    } else if (phoneNumber.country === 'MX') {
                      formatted = 'Mexico';
                    }
                  }
                }
                return <span>{formatted}</span>;
              }}
              className="phone-number-column"
            />
            <Column
              title={<span className="column-title">Phone number</span>}
              dataIndex="phone"
              key="phone"
              render={phone => {
                let formatted = 'No phone set';
                if (phone) {
                  const phoneNumber = parsePhoneNumberFromString(phone);
                  if (phoneNumber) {
                    // console.log('phone number', phoneNumber.country);
                    formatted = phoneNumber.formatNational();
                  } else {
                    formatted = phone;
                  }
                }
                return <span>{formatted}</span>;
              }}
              className="phone-number-column"
            />
            <Column
              title={<span className="column-title">Groups</span>}
              key="groups"
              render={guest =>
                Object.values(guest.groups).map(group => (
                  <Tag key={group.id}>{group.name}</Tag>
                ))
              }
            />
            <Column
              title={<span className="column-title">Actions</span>}
              key="actions"
              render={guest => (
                <Actions
                  onEdit={() =>
                    props.history.push(`${props.match.url}/edit/${guest.id}`)
                  }
                  onDelete={() =>
                    props.deleteGuest({
                      eventId: props.event.id,
                      guestId: guest.id,
                    })
                  }
                  deleteConfirmMessage="Are you sure you want to remove this guest?"
                />
              )}
              className="actions-column"
            />
          </Table>
        </Content>
      </GuestWrapper>
    </div>
  );
};

export default connect(state => ({
    event: store.select.Event.currentEvent(state),
    guests: store.select.Guest.allGuests(state),
    loading: state.loading.effects.Guest.loadGuests,
    deleting: state.loading.effects.Guest.deleteGuest,
  }),
  ({ Guest: 
    { loadGuests, deleteGuest } }) => ({
    loadGuests,
    deleteGuest,
  })
)(GuestList);
  