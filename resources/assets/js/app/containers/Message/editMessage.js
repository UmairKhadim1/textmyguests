import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Checkbox,
  DatePicker,
  TimePicker,
  Input,
  Layout,
  Form,
  Alert,
  notification,
  Modal,
  Popconfirm,
} from 'antd';
import Switch from '../../components/uielements/switch';
import Moment from 'moment';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import GroupControl from '../../components/form/GroupControl';
import ControlTooltip from '../../components/form/ControlTooltip';
import { formItemLayout, tailItemLayout } from '../../components/form/layout';
import store from '../../redux/store';
import { maxLengthValidator } from './maxLengthValidator';
import ImageUploader from './ImageUploader';
import { isEventActivated } from '../../helpers/functions';
import group from '../../redux/models/group';

const { Content } = Layout;

const MessageSendDate = ({
  onChange,
  value = {},
  nowDisabled,
  event,
  OnImmediatelyChange,
}: {
  value: {
    immediately: boolean,
    moment: Moment,
  },
  nowDisabled: boolean,
  onChange: any => void,
  event?: Object,
  OnImmediatelyChange: Function, //handle when immediately values change
}) => {
  const onChangeCheckbox = e => {
    setImmediatelyValue(e.target.checked);
    // console.log('checkbox value', e.target.checked)
    onChange({
      ...value,
      immediately: !!e.target.checked,
    });
  };

  const onChangeDatePicker = (date, dateString) => {
    onChange({
      ...value,
      date: dateString,
      moment: (value.moment || Moment()).set({
        year: date.get('year'),
        month: date.get('month'),
        date: date.get('date'),
      }),
    });
  };

  const onChangeTimePicker = (time, timeString) => {
    onChange({
      ...value,
      time: timeString,
      moment: (value.moment || Moment()).set({
        hour: time.get('hour'),
        minute: time.get('minute'),
      }),
    });
  };

  let alert;
  if (value.moment) {
    const now = Moment();
    if (
      value.moment.isAfter(now.add(5, 'minutes')) &&
      value.moment.isBefore(now.add(12, 'h'))
    ) {
      const fromNow = value.moment.fromNow(true);
      alert = `Your message will send in ${fromNow}`;
    }
  }

  const [immediatelyValue, setImmediatelyValue] = useState(false);

  useEffect(
    () => {
      if (nowDisabled) {
        setImmediatelyValue(false);
      }
    },
    [nowDisabled]
  );

  useEffect(
    () => {
      //when immediately value change pass it to parent
      value.immediately = immediatelyValue;
      OnImmediatelyChange(immediatelyValue);
    },
    [immediatelyValue]
  );
  let endDate;
  if (event && event.eventDate) {
    endDate = Moment(event.eventDate)
      .add(window.eventPadding, 'days')
      .endOf('day');
  }
  const now = Moment();
  return (
    <div>
      {endDate && now < endDate ? (
        <>
          <Checkbox
            disabled={nowDisabled}
            checked={immediatelyValue}
            onChange={onChangeCheckbox}>
            Send immediately
          </Checkbox>
          <br />
        </>
      ) : null}
      {!immediatelyValue && (
        <>
          <DatePicker
            format="MM-DD-YYYY"
            disabled={immediatelyValue}
            disabledDate={current => {
              // Disable dates in the past and later
              // than 30 days after the event.
              const minDate = Moment();
              const maxDate = endDate;

              return endDate
                ? current.isBefore(minDate, 'day') ||
                    current.isAfter(maxDate, 'day')
                : current.isBefore(minDate, 'day');
            }}
            allowClear={false}
            value={value.moment}
            onChange={onChangeDatePicker}
          />
          &nbsp;
          <TimePicker
            use12Hours
            format="h:mm a"
            allowClear={false}
            value={value.moment}
            disabled={immediatelyValue}
            onChange={onChangeTimePicker}
            disabledHours={() => {
              // We disabled hours in the past of "now + 5 minutes"
              if (value.moment.isSame(Moment(), 'day')) {
                let disabledHours = [];
                let firstAllowedHour = 1;
                // If the day changes in less than 5 minutes, disable all hours
                if (
                  value.moment.day() !==
                  Moment()
                    .add(5, 'minutes')
                    .day()
                ) {
                  firstAllowedHour = 25;
                } else {
                  firstAllowedHour = Moment()
                    .add(5, 'minutes')
                    .hour();
                }
                for (let h = 0; h < firstAllowedHour; h++) {
                  disabledHours.push(h);
                }
                return disabledHours;
              } else return [];
            }}
            disabledMinutes={() => {
              // We disable minutes < now + 5
              if (value.moment.isSame(Moment(), 'hour')) {
                let disabledMinutes = [];
                let firstAllowedMinute = 1;
                // If the hour changes in less than 5 minutes, disable all minutes
                if (
                  value.moment.hour() !==
                  Moment()
                    .add(5, 'minutes')
                    .hour()
                ) {
                  firstAllowedMinute = 61;
                } else {
                  firstAllowedMinute = Moment()
                    .add(5, 'minutes')
                    .minute();
                }

                for (let m = 0; m < firstAllowedMinute; m++) {
                  disabledMinutes.push(m);
                }
                return disabledMinutes;
              } else return [];
            }}
          />
          {alert ? <Alert message={alert} type="warning" /> : null}
        </>
      )}
    </div>
  );
};

type Props = {
  groups: Array<Object>,
  message?: Object,
  event?: Object,
  match: Object,
  loadGroups: any => void,
  loadMessage: any => void,
  saveMessage: any => void,
  saving: boolean,
  messageId: string,
  form: Object,
  history: Object,
};

const EditMessage = (props: Props) => {
  const {
    event,
    loadGroups,
    loadMessage,
    match,
    message = {},
    messageId,
    saveMessage,
    form,
    history,
    groups,
    saving,
  } = props;

  const [testMessage, setTestMessage] = useState(false);
  const [testGroup, setTestGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [enableMessage, setEnableMessage] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [immediatelyValue, setImmediatelyValue] = useState(false);

  const [isValidDate, setIsValidDate] = useState(true);

  useEffect(
    () => {
      // console.log('enableMessage....',enableMessage)
    },
    [enableMessage]
  );
  useEffect(
    () => {
      if (event && event.id) {
        loadGroups(event.id);
        if (event && event.id && messageId) {
          // We editing a message and it did not exist yet (Reloading)
          loadMessage({ eventId: event.id, messageId });
        }
      }
    },
    [event]
  );

  // useEffect(()=> {
  //   if(groups){
  //     groups.map(group => {
  //       if(group.is_testGroup){
  //         setTestGroup(true)
  //       }
  //     })
  //   }
  // })

  useEffect(
    () => {
      if (message.testMessage) {
        setTestMessage(message.testMessage);
      }
      if (message.ready_to_send) {
        setEnableMessage(message.ready_to_send);
      }
    },
    [message]
  );

  // useEffect(()=> {
  //   if(!testMessage)
  //   {
  //     console.log('test message',testMessage)
  //     if(!isEventActivated(event)){
  //       setEnableMessage(false)
  //       console.log('disable message')
  //     }
  //   }
  // }, [testMessage])

  const handleEnableMessage = e => {
    //when user enable or disable the message
    if (testMessage || isEventActivated(event)) {
      setEnableMessage(!enableMessage);
    } else {
      //if event is unactivated and user want to enable the message then show him this modal.
      setIsModalVisible(true);
      // notification.error({
      //   message: 'This is an unpaid trial event. Messages can only be sent to your Test Group at this time. Activate this event to begin sending messages to your whole guest list!'
      // })
    }
  };
  const handleOk = () => {
    //close the modal
    setIsModalVisible(false);
  };
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
  } = form;

  useEffect(
    () => {
      if (message.id) {
        const when = getFieldValue('when');
        const moment = Moment(message.send_at);
        setFieldsValue({
          when: {
            ...when,
            moment,
            time: moment.format('h:mm a'),
            date: moment.format('MM-DD-YYYY'),
          },
        });
      }
    },
    [message.id]
  );

  const groupSelected = e => {
    setSelectedGroup(e);
  };

  useEffect(
    () => {
      if (message && message.recipients) {
        let data = {};
        Object.values(message.recipients).map((acc, el) => {
          data[acc.id] = true;
        });
        setSelectedGroup(data);
      }
    },
    [message]
  );

  useEffect(
    () => {
      //check selected group
      if (selectedGroup && !isEventActivated(event)) {
        //if selected group equal to 1 and is a test group then test message is true
        if (Object.keys(selectedGroup).length === 1) {
          const groupId = Number(Object.keys(selectedGroup)[0]);
          // console.log(typeof groupId);
          let group = groups.filter(gk => {
            return gk.id === groupId && gk.is_testGroup;
          });
          if (group.length > 0) {
            // console.log('text message enable');
            setTestMessage(true);
          } else {
            setTestMessage(false);
          }
        } else {
          setTestMessage(false);
        }
      }
    },
    [selectedGroup]
  );

  useEffect(
    () => {
      //when event is unactivated and message is not test message then disable the message status
      if (!testMessage) {
        setEnableMessage(false);
      }
    },
    [testMessage]
  );

  const handleSubmit = e => {
    e.preventDefault();

    validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          values.when &&
          !values.when.immediately &&
          values.when.moment.isBefore(Moment().add(5, 'minutes'))
        ) {
          setIsValidDate(false);
        } else {
          setIsValidDate(true);
          const newMessage = {
            ...values,
            ...values.when,
            ready: values.when.immediately || enableMessage,
            recipients: groups
              .filter(group => {
                if (group.is_all) {
                  return values.recipients.all;
                }
                return values.recipients[group.id];
              })
              .map(group => ({ id: group.id })),
            testMessage: testMessage,
          };
          if (message.id) newMessage.id = message.id;
          if (event && event.id) {
            // console.log(values)
            saveMessage({
              eventId: event.id,
              message: newMessage,
              cb: () => {
                history.push('/dashboard/messages');
              },
            });
          }
        }
      }
    });
  };

  const when = getFieldValue('when');
  let immediately = when ? when.immediately : false;
  const moment = message.send_at
    ? Moment(message.send_at)
    : Moment().add(15, 'minutes');
  const defaultWhen = {
    immediately: false,
    moment,
    time: moment.format('h:mm a'),
    date: moment.format('MM-DD-YYYY'),
  };

  let endDate; // Latest date at which user can send a message
  if (event && event.eventDate) {
    endDate = Moment(event.eventDate)
      .add(window.eventPadding, 'days')
      .endOf('day');
  }

  const testmsgfunc = e => {
    setTestMessage(!testMessage);
    // console.log('enabling a disable button', e)
  };
  const showAlert = () => {
    // console.log('clicked on div')
  };

  const immediatelyChange = immd => {
    //when user checked or unchecked the immediately message
    // console.log('immediately value is ', immd)
    setImmediatelyValue(immd);
  };

  //when message is not immediately message and date is not valid then show error
  //when send immediately msg is enable then hide the error
  useEffect(
    () => {
      if (
        when &&
        !when.immediately &&
        when.moment.isBefore(Moment().add(5, 'minutes'))
      ) {
        setIsValidDate(false);
      } else {
        setIsValidDate(true);
      }
      if (immediatelyValue) {
        setIsValidDate(true);
      }
      // console.log('default values', when)
    },
    [when, immediatelyValue]
  );

  return (
    <LayoutWrapper>
      <PageHeader>
        <span className="title">
          {match.params.id ? 'Edit Message' : 'Add Message'}
        </span>
      </PageHeader>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Form.Item {...formItemLayout} label="Message Contents">
            <>
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: !form.getFieldValue('image'),
                    message: 'You must have a message or an image to send.',
                  },
                  {
                    validator: maxLengthValidator,
                  },
                ],
                initialValue: message.content,
              })(
                <ControlTooltip
                  align="start"
                  title="The current text you want to send to your guests. 160 character max">
                  <Input.TextArea />
                </ControlTooltip>
              )}
              <p style={{ lineHeight: '1.2rem' }}>
                Please note that some network carriers actively block messages
                containing shortened links like 'bit.ly' or 'tinyurl.com'. When
                adding a link, use the destination URL to avoid message
                filtering.
              </p>
            </>
          </Form.Item>

          <Form.Item {...formItemLayout} label="Attach an image">
            {getFieldDecorator('image', {
              initialValue: message.image,
              valuePropName: 'image',
            })(
              <ControlTooltip
                align="start"
                title="You can make this a picture message! In addition to the text above, you can also optionally include an image to be sent along with this message.">
                <ImageUploader
                  eventId={event.id}
                  thumbnail={props.form.getFieldValue('thumbnail')}
                  form={props.form}
                />
              </ControlTooltip>
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: '0' }}>
            {getFieldDecorator('thumbnail', {
              initialValue: message.image_thumbnail,
              valuePropName: 'thumbnail',
            })(<input type="hidden" name="thumbnail" />)}
          </Form.Item>
          {/* 
          <Form.Item {...formItemLayout} label="Test Group Only">
              {getFieldDecorator('testMessage', {
                initialValue: testMessage,
                valuePropName: 'testMessage',
              })(
                <ControlTooltip title="When on, this message will only send to test group.">
                  <Switch onClick = { testmsgfunc } checked={ testMessage } />
                </ControlTooltip>
              )}
            </Form.Item> */}

          <Form.Item required {...formItemLayout} label="Time to send">
            {getFieldDecorator('when', {
              initialValue: defaultWhen,
              rules: [
                {
                  validator: (rules, value, callback) => {
                    // The user must selected a date after "now + 5 minutes"
                    // if (value.moment.isBefore(Moment().add(5, 'minutes'))) {
                    //   callback(
                    //     'Your message must be scheduled later than 5 minutes from now.'
                    //   );
                    // }

                    // The user must either check "send now" or set a date
                    if (!value.immediately && !value.moment) {
                      callback('Please set a moment to send the message');
                    }

                    callback();
                  },
                },
              ],
            })(
              <ControlTooltip
                title={
                  endDate
                    ? `You may schedule messages from today until ${endDate.format(
                        'MMM Do, YYYY'
                      )} (30 days after your event date).`
                    : 'You may schedule messages from today until 30 days after your event date.'
                }>
                <MessageSendDate
                  nowDisabled={
                    !isEventActivated(event)
                      ? testMessage
                        ? false
                        : true
                      : false
                  }
                  event={event}
                  OnImmediatelyChange={immediatelyChange}
                />
              </ControlTooltip>
            )}
            {!isValidDate ? (
              <p style={{ color: 'red' }}>
                Your message must be scheduled later than 5 minutes from now.
              </p>
            ) : (
              ''
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} required label="Recipients">
            {getFieldDecorator('recipients', {
              // This is for setting the all property
              valuePropName: 'selected',
              initialValue: Object.values(message.recipients || {}).reduce(
                (acc, el) => {
                  if (el.is_all) acc.all = true;
                  else acc[el.id] = true;
                  return acc;
                },
                {}
              ),
              rules: [
                {
                  type: 'object',
                  validator: (rules, value, callback) => {
                    if (Object.keys(value).length === 0) {
                      callback(
                        'You must set at least one recipient for the message'
                      );
                    }
                    callback();
                  },
                },
              ],
            })(
              <ControlTooltip
                align="start"
                title="Select the groups you want to send the message to">
                <GroupControl
                  groups={groups}
                  disableIfAll={true}
                  onClick={groupSelected}
                />
              </ControlTooltip>
            )}
          </Form.Item>
          {immediatelyValue ? null : (
            <Form.Item {...formItemLayout} label="Enabled">
              {getFieldDecorator('ready', {
                initialValue: enableMessage,
              })(
                <div onClick={showAlert}>
                  <ControlTooltip title="When off, this message will be saved as a draft and will not send. Switch on to allow this message to send at the above scheduled time.">
                    <Switch
                      checked={enableMessage}
                      onClick={handleEnableMessage}
                    />
                  </ControlTooltip>
                  <Modal
                    title="Warning"
                    visible={isModalVisible}
                    footer={[
                      <Button key="submit" type="primary" onClick={handleOk}>
                        Okay
                      </Button>,
                    ]}>
                    <p>
                      This is an unpaid trial event. Messages can only be sent
                      to your Test Group at this time. Activate this event to
                      begin sending messages to your whole guest list!
                    </p>
                  </Modal>
                </div>
              )}
            </Form.Item>
          )}
          <Form.Item {...tailItemLayout}>
            {immediatelyValue && (isEventActivated(event) || testMessage) ? (
              <Popconfirm
                title={
                  <span style={{ fontSize: 18, color: 'red' }}>
                    Do you really want to send this message now?
                  </span>
                }
                okText="Send Now"
                onConfirm={handleSubmit}>
                <Button
                  loading={saving}
                  disabled={saving}
                  icon="rocket"
                  htmlType="button"
                  type="primary">
                  Send Now
                </Button>
              </Popconfirm>
            ) : (
              <Button
                loading={saving}
                disabled={saving}
                htmlType="submit"
                type="primary">
                Save Message
              </Button>
            )}
          </Form.Item>
        </Form>
      </Content>
    </LayoutWrapper>
  );
};

export default connect(
  (state, { match }) => ({
    event: store.select.Event.currentEvent(state),
    messageId: match.params.id,
    message: match.params.id
      ? store.select.Message.messageById(state, match.params.id)
      : undefined,
    groups: store.select.Group.allGroups(state),
    saving: state.loading.effects.Message.saveMessage,
  }),
  ({ Message: { saveMessage, loadMessage }, Group: { loadGroups } }) => ({
    saveMessage,
    loadMessage,
    loadGroups,
  })
)(Form.create({})(EditMessage));
