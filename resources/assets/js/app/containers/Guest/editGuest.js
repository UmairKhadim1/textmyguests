 import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Layout, Form } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import {
  responsiveFormItemLayout,
  formItemLayout,
  tailItemLayout,
} from '../../components/form/layout';
import GroupControl from '../../components/form/GroupControl';
import ControlTooltip from '../../components/form/ControlTooltip';
import store from '../../redux/store';
import { Link } from 'react-router-dom';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import ReactPixel from '../../components/pixel/FacebookPixel';
import ReactGA from '../../components/pixel/ReactGA';
import ReactPinterestTag from '../../components/pixel/PinterestPixel';

// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
// import { isPossiblePhoneNumber } from 'react-phone-number-input'
// import { isValidPhoneNumber } from 'react-phone-number-input'

import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import './editguest.css';
const { Content } = Layout;

let selCountry = 'US';
export const validatePhoneNumber = (rule, value, callback) => {
  // We don't need to validate an empty value.
  // There is another validator for it and we don't want to display
  // 2 error messages at the same time.
  if (!value) {
    callback();
    return;
  }
  // console.log(country);
  const phoneNumber = parsePhoneNumberFromString(value, country);
  // console.log(phoneNumber);
  if (!phoneNumber || !phoneNumber.isValid()) {
    callback('You must enter a valid phone number.');
    return;
  }

  if (
    phoneNumber.country !== 'US' &&
    phoneNumber.country !== 'CA' &&
    phoneNumber.country !== 'MX'
  ) {
    callback('You must enter a phone number from United States or Canada.');
    return;
  }

  callback();
};

const phoneInputLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 10 },
    lg: { span: 6 },
  },
};

type Props = {
  groups: Array<Object>,
  guest?: Object,
  event?: Object,
  saving: boolean,
  match: Object,
  history: Object,
  form: Object,
  loadGroups: number => void,
  loadGuest: ({ eventId: number, guestId: number }) => void,
  saveGuest: ({ eventId: number, guest: Object, cb?: Function }) => void,
};

const EditGuest = (props: Props) => {
  const {
    event,
    guest = {},
    groups,
    loadGuest,
    saveGuest,
    loadGroups,
    match,
    history,
    form,
    saving,
  } = props;
  useEffect(
    () => {
      if (event && event.id) {
        loadGroups(event.id); // refresh the group data
        if (match.params.id && !guest.id) {
          // We editing a message and it did not exist yet (Reloading)
          loadGuest({ eventId: event.id, guestId: Number(match.params.id) });
        }
      }
    },
    [(event || {}).id]
  );

  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const [mobilePhone, setMobilePhone] = useState();
  const [selectCountry, setSelectCountry] = useState('us');
  const [oldCountry, setOldCountry] = useState('');
  const [is_Valid, setIs_Valid] = useState(true);
  let labels = ['US', 'MX'];
  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newGuest = {
          ...values,
          groups: groups.filter(
            group => group.id in values.groups && !group.is_all
          ),
        };
        newGuest.id = guest.id;
        newGuest.country = selectCountry;
        // console.log(newGuest);

        // Format the phone number to '+1**********' where * is a number
        const phoneNumber = parsePhoneNumberFromString(
          newGuest.phone,
          selectCountry
        );
        const formattedPhoneNumber = phoneNumber.format('E.164');

        // if(phoneNumber && phoneNumber.isValid()){
        newGuest.phone = formattedPhoneNumber;
        if (event && event.id) {
          saveGuest({
            eventId: event.id,
            guest: newGuest,
            cb: () => {
              //Pinterest Pixel
              ReactPinterestTag.track('cutom', {
                event_time: new Date().toISOString(),
                evemt_name: 'Guest Added',
              });
              //Facebook Pixel
              ReactPixel.trackCustom('GuestAdded', new Date().toISOString()); //add Guest log on facebook
              //Google Analytics
              ReactGA.timing({
                category: 'Guest added',
                variable: 'Guest',
                value: 1,
                label: new Date().toISOString(),
              });
              history.push('/dashboard/guests');
            },
          });
        }
        // }
        // else{
        //   setIs_Valid(true)
        // }
      }
    });
  };

  const checkmobile = (value, cntry, e, formated) => {
    // console.log('clicked');
    // console.log('country code', cntry.countryCode);
    // console.log('old country', selectCountry);
    if (cntry.countryCode !== oldCountry) {
      if (cntry.countryCode === 'mx') {
        setMobilePhone('52');
        setIs_Valid(true);
        // console.log('done');
      } else {
        setIs_Valid(true);
        setMobilePhone('1');
      }
      setOldCountry(cntry.countryCode);
    } else {
      let phoneNumber = parsePhoneNumberFromString(
        value,
        cntry.countryCode.toUpperCase()
      );
      if (phoneNumber && phoneNumber.isValid()) {
        if (cntry.countryCode === 'mx' && value.length < 11) {
          setIs_Valid(true);
        } else {
          // console.log('phone Number is ', phoneNumber)
          setIs_Valid(false);
        }
      } else {
        // console.log('invalid phone number')
        setIs_Valid(true);
      }

      // console.log(value, cntry, e, formated)
      setSelectCountry(cntry.countryCode.toUpperCase());
      setMobilePhone(value);
    }
  };

  useEffect(
    () => {
      if (guest && guest.phone) {
        let phoneNumber = parsePhoneNumberFromString(guest.phone);
        // console.log(phoneNumber);

        // setSelectCountry(phoneNumber.country.toLowerCase())
        setMobilePhone(phoneNumber.number);
        setOldCountry(phoneNumber.country.toLowerCase());
        setIs_Valid(false);
      }
    },
    [guest]
  );
  const getGroup = e => {
    // console.log(e)
  };
  // Format phone initial value
  const parsed = guest.phone ? parsePhoneNumberFromString(guest.phone) : null;
  const phoneInitialValue = parsed
    ? parsed.format('NATIONAL')
    : guest.phone
      ? guest.phone
      : '';

  return (
    <LayoutWrapper>
      <PageHeader>
        <span className="title">
          {match.params.id ? 'Edit Guest' : 'Add Guest'}
        </span>
      </PageHeader>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Form.Item {...responsiveFormItemLayout} label="Guest First Name">
            {getFieldDecorator('firstname', {
              initialValue: guest.first_name,
            })(
              <ControlTooltip title="The first name of the guest.">
                <Input />
              </ControlTooltip>
            )}
          </Form.Item>
          <Form.Item {...responsiveFormItemLayout} label="Guest Last Name">
            {getFieldDecorator('lastname', {
              initialValue: guest.last_name,
            })(
              <ControlTooltip title="The last name of the guest.">
                <Input />
              </ControlTooltip>
            )}
          </Form.Item>
          <Form.Item {...responsiveFormItemLayout} label="Guest Phone">
            {getFieldDecorator('phone', {
              initialValue: mobilePhone,
              // rules: [
              //   {
              //     required: true,
              //     message: 'You must enter the phone number of the guest.',
              //   },
              // ],
            })(
              <>
                <ControlTooltip title="The phone number of the guest. Ten digits.">
                  {/* <Input addonBefore="+1" /> */}
                  <PhoneInput
                    country={selectCountry}
                    value={mobilePhone}
                    onChange={checkmobile}
                    countryCodeEditable={false}
                    onlyCountries={['us', 'mx']}
                  />
                </ControlTooltip>
                {is_Valid ? (
                  <p style={{ color: 'red' }}>
                    You must enter a valid phone number
                  </p>
                ) : (
                  ''
                )}
              </>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="Groups">
            {getFieldDecorator('groups', {
              // This is for setting the all property
              normalize: (value, prevValue) => {
                if (!value.all) {
                  // Just unchecked all object, ignore this modification
                  if (
                    Object.keys(value).length === 0 &&
                    Object.keys(prevValue).length > 2
                  ) {
                    return prevValue;
                  }
                  // Always set all guests to selected
                  return { ...value, all: true };
                }
                return value;
              },
              valuePropName: 'selected',
              initialValue: Object.values(
                guest.groups ? guest.groups : {}
              ).reduce(
                (acc, el) => {
                  acc[el.id] = true;
                  return acc;
                },
                { all: true }
              ),
              rules: [
                {
                  type: 'object',
                  validator: (rules, value, callback) => {
                    if (Object.keys(value).length) {
                      callback();
                      return;
                    }
                    callback('Your guest must be part of some groups');
                  },
                },
              ],
            })(
              <ControlTooltip
                align="start"
                title="The groups this guest will belong to">
                <GroupControl
                  groups={groups}
                  is_hide_testGroup="true"
                  onClick={getGroup}
                />
              </ControlTooltip>
            )}
          </Form.Item>

          <Form.Item />

          <Form.Item {...tailItemLayout}>
            <Link to="/dashboard/guests">
              <Button type="default" style={{ marginRight: '10px' }}>
                Cancel
              </Button>
            </Link>
            <Button
              disabled={saving}
              type="primary"
              loading={saving}
              htmlType="submit">
              Save Guest
            </Button>
          </Form.Item>
        </Form>
        {/* <PhoneInput
                  value={mobilePhone}
                  international= {false}
                  onChange={checkmobile}
                  onCountryChange = {checkCountry}
                  defaultCountry="US"
                  countries={['US', 'MX']}/> */}

        {/* <PhoneInput
            country={selectCountry}
            value={mobilePhone}
            onChange={checkmobile}
            countryCodeEditable={false}
            onlyCountries={['us', 'mx']}
          /> */}
      </Content>
    </LayoutWrapper>
  );
};

export default connect(
  (state, { match }) => ({
    event: store.select.Event.currentEvent(state),
    groups: store.select.Group.allGroups(state),
    guest:
      match.params && match.params.id
        ? store.select.Guest.guestById(state, match.params.id)
        : undefined,
    saving: state.loading.effects.Guest.saveGuest,
  }),
  ({ Group: { loadGroups }, Guest: { saveGuest, loadGuest } }) => ({
    loadGroups,
    loadGuest,
    saveGuest,
  })
)(Form.create()(EditGuest));
