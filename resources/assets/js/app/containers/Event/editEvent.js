import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, DatePicker, Input, Form } from 'antd';
import Switch from '../../components/uielements/switch';
import Select, { SelectOption } from '../../components/uielements/select';
import Timezones from './timezones.json';
import States from './us_states.json';
import { formItemLayout, tailItemLayout } from '../../components/form/layout';
import ControlTooltip from '../../components/form/ControlTooltip';
import moment from 'moment-timezone';
import styled from 'styled-components';
import theme from '../../config/themes/themedefault';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneNumberInfo from './PhoneNumberInfo';
import ReactPixel from '../../components/pixel/FacebookPixel';
import ReactGA from '../../components/pixel/ReactGA';
import ReactPinterestTag from '../../components/pixel/PinterestPixel';

const SectionTitle = styled.h3`
  font-size: 1.15rem;
  margin: 1rem 0rem 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @media only screen and (min-width: 992px) {
    margin: 1rem 2rem 1.5rem;
  }
`;

const PhoneNumberList = styled.div`
  margin-top: 10px;
  margin-left: 0.25rem;
  font-weight: 600;
  line-height: 1.5;
`;

// Array format (do it once)
const timezones = Object.keys(Timezones).map(tz => ({
  timezone: tz,
  text: Timezones[tz],
}));

type LocationProps = {
  location: {
    city: string,
    state: string,
    country: string,
  },
  onChange: Function,
};

const COUNTRY = 'US';

const LocationInput = (props: LocationProps) => {
  const createHandler = valueName => value =>
    handleChange({
      ...props.location,
      country: COUNTRY,
      [valueName]: value,
    });
  const handleChangeCity = createHandler('city');
  const handleChangeState = createHandler('state');

  const handleChange = location => {
    if (props.onChange) props.onChange(location);
  };

  const handleCityInputChange = e => {
    handleChangeCity(e.target.value);
  };

  const { city, state } = props.location || {};
  return (
    <div>
      <Input
        value={city}
        onChange={handleCityInputChange}
        placeholder="City Name"
      />
      <Select
        showSearch
        filterOption={(filter, option) =>
          option.props.children.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        }
        value={state}
        onChange={handleChangeState}
        placeholder="State">
        {States.map(state => (
          <SelectOption key={state.name}>{state.name}</SelectOption>
        ))}
      </Select>
      <div>United States of America</div>
    </div>
  );
};

const TimezoneMessage = styled.div`
  margin-top: 5px;
  line-height: 1.25;
  font-weight: 600;

  span {
    font-weight: 900;
    color: rgb(247, 56, 97);
  }
`;

type FormProps = {
  event: Object,
  saveEvent: Object => void,
  saving: boolean,
  form: Object,
  history: Object,
};

class EditEventForm extends Component<FormProps> {
  getDefaultTimezone = () => -(new Date().getTimezoneOffset() / 60);

  handleSubmit = e => {
    e.preventDefault();
    const { form, saveEvent, history, event } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveEvent({
          event: { id: event ? event.id : undefined, ...values },
          cb: (event, created) => {
            if (created) {
              //Pinterest Pixel
              ReactPinterestTag.track('cutom', {
                event_time: new Date().toISOString(),
                evemt_name: 'Event Created',
              });
              //Facebook Pixel
              ReactPixel.trackCustom('EventCreated', new Date().toISOString()); //Event Createdd log on facebook
              //Google Analytics
              ReactGA.timing({
                category: 'Event Created',
                variable: 'Event',
                value: 1,
                label: new Date().toISOString(),
              });

              history.push('/dashboard');
            } else {
              ReactPinterestTag.track('cutom', {
                event_time: new Date().toISOString(),
                evemt_name: 'Event Updated',
              });
              ReactPixel.trackCustom('EventUpdated', new Date().toISOString()); //Event Updated log on facebook

              ReactGA.timing({
                category: 'Event Updated',
                variable: 'Event',
                value: 1,
                label: new Date().toISOString(),
              });
            }
          },
        });
      }
    });
  };

  displayTimezoneMessage = () => {
    const timezone = this.props.form.getFieldValue('timezone');

    if (!timezone) {
      return null;
    }

    const time = moment()
      .tz(timezone)
      .format('LT');

    return (
      <TimezoneMessage>
        It is <span>{time}</span> in this timezone right now. Please ensure your
        timezone setting is correct, as this timezone will be used to schedule
        delivery of all text messages.
      </TimezoneMessage>
    );
  };

  render() {
    const event = this.props.event || {};
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        {event && event.id && <SectionTitle>Event settings</SectionTitle>}
        <Form.Item {...formItemLayout} label="Title">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'The event must have a name.',
              },
            ],
            initialValue: event.name,
          })(
            <ControlTooltip title="The title of your event, i.e. Jordan and Kayla's Wedding">
              <Input />
            </ControlTooltip>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Location">
          {getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: 'The event must have a location.',
              },
            ],
            valuePropName: 'location',
            initialValue: event.location,
          })(
            <ControlTooltip title="Where will the event take place?">
              <LocationInput />
            </ControlTooltip>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Timezone">
          {getFieldDecorator('timezone', {
            rules: [
              {
                required: true,
                message: 'Please set the timezone of the location of the event',
              },
            ],
            initialValue: event.timezone,
          })(
            <ControlTooltip title="This is the timezone your messages will be scheduled and sent in.">
              <Select>
                {timezones.map(timezone => (
                  <SelectOption key={timezone.timezone}>
                    {timezone.text}
                  </SelectOption>
                ))}
              </Select>
            </ControlTooltip>
          )}
          {this.displayTimezoneMessage()}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Event Date">
          {getFieldDecorator('event_date', {
            rules: [
              {
                type: 'object',
                required: false,
                validator: (rule, date, callback) => {
                  // If selected date is in the past, throw validation error
                  if (
                    date &&
                    date.isBefore(Moment(), 'day') &&
                    date !== event.eventDate
                  ) {
                    callback('You cannot select a date in the past.');
                  }
                  callback();
                },
              },
            ],
            initialValue: event.eventDate,
          })(
            <ControlTooltip title="When will the event take place? If you're not sure, you can fill this out later.">
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={current => current.isBefore(Moment(), 'day')}
                disabled={event.payment && event.payment.activated}
              />
            </ControlTooltip>
          )}
          {event.payment &&
            event.payment.activated && (
              <div
                style={{
                  marginTop: '5px',
                  lineHeight: 1.25,
                  fontWeight: 600,
                }}>
                Your event date is locked.{' '}
                <Link to="/dashboard/contact">Contact us</Link> to change it.
              </div>
            )}
        </Form.Item>

        {event &&
          event.id && (
            <Form.Item {...formItemLayout} label="Event Phone Numbers">
              {event.payment && event.payment.activated ? (
                <>
                  <PhoneNumberList>
                    {event.phoneNumbers.map((phoneNumber, i, phoneNumbers) => {
                      const pn = parsePhoneNumberFromString(phoneNumber, 'US');
                      if (i !== phoneNumbers.length - 1) {
                        return pn.formatNational() + ', ';
                      }
                      return pn.formatNational();
                    })}
                  </PhoneNumberList>
                  <PhoneNumberInfo />
                </>
              ) : (
                <div>
                  {event.phoneNumbers ? (
                    <>
                      <PhoneNumberList>
                        {event.phoneNumbers.map(
                          (phoneNumber, i, phoneNumbers) => {
                            const pn = parsePhoneNumberFromString(
                              phoneNumber,
                              'US'
                            );
                            if (i !== phoneNumbers.length - 1) {
                              return pn.formatNational() + ', ';
                            }
                            return pn.formatNational();
                          }
                        )}
                      </PhoneNumberList>
                      <i
                        className="ion-information-circled"
                        style={{
                          marginRight: '0.4rem',
                          color: theme.palette.primary[0],
                        }}
                      />
                      Your phone number will expire on {event.expiry}. Activate
                      this event to use this number.
                    </>
                  ) : (
                    <>
                      <i
                        className="ion-information-circled"
                        style={{
                          marginRight: '0.4rem',
                          color: theme.palette.primary[0],
                        }}
                      />
                      Once your event is activated, we will assign a dedicated
                      phone number to your event.
                    </>
                  )}

                  <PhoneNumberInfo />
                </div>
              )}
            </Form.Item>
          )}

        <Form.Item {...tailItemLayout}>
          <Button loading={this.props.saving} htmlType="submit" type="primary">
            Save Event
          </Button>
        </Form.Item>

        {event &&
          event.id && (
            <>
              <SectionTitle style={{ marginTop: '2.5rem' }}>
                Reply Stream Settings
              </SectionTitle>
              <Form.Item
                {...formItemLayout}
                label="&quot;Join this event&quot; button">
                {getFieldDecorator('show_join_button', {
                  valuePropName: 'checked',
                  initialValue: !!event.showJoinButton,
                })(
                  <ControlTooltip title="A button is displayed at the top of your Reply Stream to invite people to join your event. You can remove this button if you want.">
                    <Switch />
                  </ControlTooltip>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="Text to Join">
                {getFieldDecorator('text_to_join', {
                  valuePropName: 'checked',
                  initialValue: !!event.textToJoin,
                })(
                  <ControlTooltip title="If you enable the &quot;Text to Join&quot; setting, guests can join your event by texting &quot;join&quot; to any one of the phone numbers above. This is handy for guests attending your event who may not be on the list but want to join after the event is already in progress.">
                    <Switch
                      disabled={!event.payment || !event.payment.activated}
                    />
                  </ControlTooltip>
                )}
              </Form.Item>

              <Form.Item {...tailItemLayout}>
                <Button
                  loading={this.props.saving}
                  htmlType="submit"
                  type="primary">
                  Save Settings
                </Button>
              </Form.Item>
            </>
          )}
      </Form>
    );
  }
}

const WrappedForm = Form.create({ name: 'edit-event' })(
  withRouter(EditEventForm)
);

export default connect(
  state => ({
    saving: state.loading.effects.Event.saveEvent,
  }),
  ({ Event }) => ({
    saveEvent: Event.saveEvent,
  })
)(WrappedForm);
