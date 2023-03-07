// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Layout, Form, Transfer } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import { formItemLayout, tailItemLayout } from '../../components/form/layout';
import ControlTooltip from '../../components/form/ControlTooltip';
import store from '../../redux/store';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { notification } from 'antd';
import guest from '../../redux/models/guest';
import group from '../../redux/models/group';
import message from '../../redux/models/message';
import './group.css';
const { Content } = Layout;

const ResponsiveTransferWrapper = styled.div`
  @media only screen and (max-width: 576px) {
    margin-top: 5px;
    > div {
      justify-content: center;
    }
    .ant-transfer {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
    }
    .ant-transfer-list {
      width: 100%;
    }
    .ant-transfer-operation {
      margin: 10px 0px;
    }
  }
`;

type FormProps = {
  guests: Array<Object>,
  group: Object,
  saving: boolean,
  onSaveGroup: Object => void,
  form: Object,
};

class EditGroupForm extends Component<FormProps> {
  static propTypes = {};
  constructor(props) {
    super(props);

    this.state = {
      destKeys: {},
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.props && this.props.group && this.props.group.is_testGroup) {
        if (!err) {
          const group = {
            ...values,
            guests: values.guests.map(id => ({ id })),
          };
          group.id = this.props.group ? this.props.group.id : undefined;
          this.props.onSaveGroup(group);
        }
      } else {
        if (values.name === 'Test Group') {
          notification.error({
            message: 'You can not enter "Test Group" as group name',
          });
        } else {
          if (!err) {
            const group = {
              ...values,
              guests: values.guests.map(id => ({ id })),
            };
            group.id = this.props.group ? this.props.group.id : undefined;
            this.props.onSaveGroup(group);
          }
        }
      }
    });
  };

  addGuestToGroup = (targetKeys, direction, moveKeys, guests) => {
    // Copy the previous selected guest, aka pure
    guests = targetKeys.reduce((acc, el) => {
      acc[el.toString()] = { id: el };
      return acc;
    }, {});

    // this.setState({
    //   destKeys:
    // })
    // moveKeys, is the guest that are part of the current operation
    moveKeys.forEach(key => {
      if (direction === 'right') {
        //Left to right, adding guest to groups
        guests[key.toString()] = { id: key };
      } else {
        // Right to left, removing guests from group;
        delete guests[key.toString()];
      }
    });
    // console.log(targetKeys)
    // console.log('as', guests);
    this.setState({
      destKeys: { ...guests },
    });
    return guests;
  };
  componentDidMount() {
    if (this.props) {
      // console.log('did mount props', this.props);
      // console.log('did mount pre props', prevProps)
      if (this.props.group) {
        const group = this.props.group;
        if (group && group.guests) {
          let gstlist = {};
          Object.entries(group.guests).map((key, value) => {
            const val = key[1].id;
            let valstring = val.toString();
            // const gstValue = (key[1].id).toString()
            gstlist[valstring] = { id: val };
          });
          this.setState({
            destKeys: { ...gstlist },
          });
        }
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.group && this.props.group != prevProps.group) {
      const group = this.props.group;
      if (group && group.guests) {
        let gstlist = {};
        Object.entries(group.guests).map((key, value) => {
          const val = key[1].id;
          let valstring = val.toString();
          // const gstValue = (key[1].id).toString()
          gstlist[valstring] = { id: val };
        });
        this.setState({
          destKeys: { ...gstlist },
        });
        // console.log(gstlist);
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const group = this.props.group || {};
    const checkvalue = [];
    // console.log(group)
    // console.log('group')
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: group.name,
            rules: [
              {
                required: true,
                message: 'The group name is required',
              },
              {
                max: 30,
                message: 'Group name can not exceed more than 30 characters',
              },
            ],
          })(
            <ControlTooltip
              title={
                group.is_testGroup
                  ? 'Test group name can not be changed'
                  : 'The name this group will be identified by'
              }>
              <Input disabled={group.is_testGroup} />
            </ControlTooltip>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Members" id="GuestGroup">
          <ResponsiveTransferWrapper>
            {getFieldDecorator('guests', {
              initialValue: Object.values(group.guests || {}).map(
                guest => guest.id
              ),
              // Modify the guests value, which is actually the target keys
              getValueFromEvent: (targetKeys, direction, moveKeys) => {
                var guests = this.state.destKeys;
                // console.log('destkeys', this.state.destKeys);
                // console.log('guests before ', guests)
                if (group.is_testGroup) {
                  if (targetKeys.length < 16) {
                    guests = this.addGuestToGroup(
                      targetKeys,
                      direction,
                      moveKeys,
                      guests
                    );
                    // console.log('less than 6', guests);
                  } else {
                    notification.error({
                      message: 'You can not add more than 15 guests',
                    });
                    // console.log('greater than 16', guests);
                  }
                } else {
                  guests = this.addGuestToGroup(
                    targetKeys,
                    direction,
                    moveKeys,
                    guests
                  );
                }
                // console.log('guests')
                // console.log(targetKeys);
                // console.log('guests', guests);
                // console.log('destkeys', this.state.destKeys);
                return Object.values(guests).map(guest => guest.id);
              },
              valuePropName: 'targetKeys',
            })(
              <ControlTooltip title="You can easily manage the guests of this group here or add guests">
                <Transfer
                  rowKey={guest => guest.id}
                  operations={['Include', 'Remove']}
                  dataSource={Object.values(this.props.guests)}
                  style={{ display: 'flex', alignItems: 'center' }}
                  listStyle={{ flexGrow: 1 }}
                  locale={{
                    itemUnit: '',
                    itemsUnit: '',
                  }}
                  titles={['Not in Group', 'Included in Group']}
                  render={guest =>
                    `${guest.last_name}${guest.last_name ? ', ' : ''}${
                      guest.first_name
                    }`
                  }
                />
              </ControlTooltip>
            )}
          </ResponsiveTransferWrapper>
        </Form.Item>
        <Form.Item {...tailItemLayout}>
          <Link to="/dashboard/groups">
            <Button type="default" style={{ marginRight: '10px' }}>
              Cancel
            </Button>
          </Link>
          <Button
            disabled={this.props.saving}
            loading={this.props.saving}
            htmlType="submit"
            type="primary">
            Save Group
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedForm = Form.create()(EditGroupForm);

type Props = {
  guests: Array<Object>,
  group?: Object,
  event?: Object,
  saving: boolean,
  match: Object,
  history: Object,
  loadGuests: string => void,
  loadGroup: ({ eventId: string, groupId: string }) => void,
  saveGroup: ({ eventId: string, group: Object, cb: Function }) => void,
};

class EditGroup extends Component<Props> {
  static defaultProps = {
    guests: [],
  };
  constructor(props) {
    super(props);

    this.state = {
      checkStatus: false,
    };
  }

  reloadData = () => {
    const { event, loadGuests, loadGroup, match, group } = this.props;
    if (event && event.id) {
      loadGuests(event.id); // refresh the guests data
      if (match.params.id && (!group || !group.id)) {
        // We editing a group and it did not exist in the state yet (Reloading)
        loadGroup({ eventId: event.id, groupId: Number(match.params.id) });
        if (group && group.guests) {
          this.setState({
            checkStatus: true,
          });
        }
        // console.log(group)
        // console.log('guest list')
      }
    }
  };

  componentDidMount() {
    this.reloadData();
  }

  componentDidUpdate(prevProps) {
    const { event } = this.props;
    if (event && (!prevProps.event || prevProps.event.id !== event.id)) {
      this.reloadData();
    }
  }

  onSaveGroup = group => {
    const { event, history } = this.props;
    if (event && event.id) {
      this.props.saveGroup({
        eventId: event.id,
        group,
        cb: () => {
          history.push('/dashboard/groups');
        },
      });
    }
  };

  render() {
    return (
      <LayoutWrapper>
        <PageHeader>
          <span className="title">
            {this.props.match.params.id ? 'Edit Group' : 'Add Group'}
          </span>
        </PageHeader>
        <Content style={{ maxWidth: '100%' }}>
          <WrappedForm
            saving={this.props.saving}
            guests={this.props.guests}
            group={this.props.group}
            onSaveGroup={this.onSaveGroup}
          />
        </Content>
      </LayoutWrapper>
    );
  }
}

export default connect(
  (state, { match }) => ({
    event: store.select.Event.currentEvent(state),
    guests: store.select.Guest.allGuests(state),
    group:
      match.params && match.params.id
        ? store.select.Group.groupById(state, match.params.id)
        : undefined,
    saving: state.loading.effects.Group.saveGroup,
  }),
  ({ Group: { saveGroup, loadGroup }, Guest: { loadGuests } }) => ({
    loadGuests,
    loadGroup,
    saveGroup,
  })
)(EditGroup);
