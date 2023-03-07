import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout, Table, Button } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import Actions from '../../components/dataTable/actions.js';
import store from '../../redux/store';
import styled from 'styled-components';

const { Column } = Table;
const { Content } = Layout;

const GroupList = (props: {
  event?: Object,
  loading: boolean,
  deleting: boolean,
  groups: Array<Object>,
  loadGroups: (eventId: string) => void,
  deleteGroup: ({ eventId: string, groupId: string, cb: Function }) => void,
  history: Object,
  match: Object,
}) => {
  useEffect(
    () => {
      const { event, loadGroups } = props;
      if (event) loadGroups(event.id);
    },
    [props.event]
  );

  const goToAddGroup = () => props.history.push(`${props.match.url}/edit/`);

  const StyledTable = styled(Table)`
    .actions-column {
      width: 105px;
      min-width: 105px;
      max-width: 105px;
      text-align: center;
    }
  `;

  return (
    <div>
      <LayoutWrapper>
        <PageHeader>
          <span className="title">Groups</span>
          <Button icon="plus" type="primary" onClick={goToAddGroup}>
            Add new Group
          </Button>
        </PageHeader>
        <Content style={{ overflow: 'auto' }}>
          <StyledTable
            loading={{
              spinning: props.loading || props.deleting,
              tip: props.deleting ? 'Deleting' : 'Loading',
            }}
            rowKey={group => group.id}
            dataSource={props.groups}>
            <Column
              title={<span className="column-title">Group name</span>}
              key="name"
              dataIndex="name"
            />
            <Column
              title={<span className="column-title">Number of guests</span>}
              align="center"
              render={group => group.guest_count}
              key="guestCount"
            />
            <Column
              title={<span className="column-title">Actions</span>}
              key="actions"
              render={group =>
                group.is_all ? null : (
                  <Actions
                    onEdit={() =>
                      props.history.push(`${props.match.url}/edit/${group.id}`)
                    }
                    onDelete={() =>
                      props.deleteGroup({
                        eventId: props.event.id,
                        groupId: group.id,
                      })
                    }
                    is_testGroup = {group.is_testGroup}
                    deleteConfirmMessage="Are you sure you want to delete this group?"
                  />
                )
              }
              className="actions-column"
            />
          </StyledTable>
        </Content>
      </LayoutWrapper>
    </div>
  );
};

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    groups: store.select.Group.allGroups(state),
    loading: state.loading.effects.Group.loadGroups,
    deleting: state.loading.effects.Group.deleteGroup,
  }),
  ({ Group: { loadGroups, deleteGroup } }) => ({
    loadGroups,
    deleteGroup,
  })
)(GroupList);
