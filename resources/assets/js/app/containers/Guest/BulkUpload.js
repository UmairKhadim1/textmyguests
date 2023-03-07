// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Layout } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import GroupControl from '../../components/form/GroupControl';
import ControlTooltip from '../../components/form/ControlTooltip';
import { formItemLayout, tailItemLayout } from '../../components/form/layout';
import store from '../../redux/store';
import type { Event, Guest, ID, Group } from '../../type';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const CSV_HEADER = 'First Name, Last Name, Phone Number (10 digits)';

const stringToGuestArray = (
  str: string
): Array<
  | Guest
  | {
      line: number,
    }
> => {
  const guests = [];
  let start = 0;
  if (str && str.trim().length) {
    str.split('\n').forEach((line: string, ln: number) => {
      if (line.startsWith(CSV_HEADER.substr(0, 11))) {
        // Skip if line is an header
        start = 1;
        return;
      }
      const guest: Guest = {
        line: ln + start, // Line Number for validation
      };
      const fields = line.split(',');
      if (fields.length) {
        guest.first_name = fields[0];
      }
      if (fields.length > 1) {
        guest.last_name = fields[1];
      }
      if (fields.length > 2) {
        guest.phone = fields[2].trim();
      }
      guests.push(guest);
    });
  }
  return guests;
};

const guestArrayToString = (guests: Array<Guest> = []): string =>
  CSV_HEADER +
  '\n' +
  guests
    .map(guest => {
      let line = guest.first_name || '';
      if (typeof guest.last_name === 'string')
        line = `${line},${guest.last_name}`;
      if (typeof guest.phone === 'string') line = `${line},${guest.phone}`;
      return line;
    })
    .join('\n');

const TextArea = (props: { onChange: any => void }) => (
  <div style={{ flexGrow: 1 }}>
    <Input.TextArea {...props} />
    <Button
      onClick={() => {
        props.onChange(CSV_HEADER + '\n');
      }}>
      Clear
    </Button>
  </div>
);

const validateGuests = (
  rules,
  value: Array<
    | Guest
    | {
        line: number,
      }
  > = [],
  callback
) => {
  const errors: Array<String> = [];
  value.forEach(guest => {
    const nameIsPresent =
      (guest.first_name && guest.first_name.trim()) ||
      (guest.last_name && guest.last_name.trim());
    if (!(nameIsPresent || guest.phone))
      // Empty line
      return;
    let error = '';
    if (!nameIsPresent)
      // Should have a first or last name, no empty name
      error += ': Either First or Last Name';
    if ((guest.phone || '').trim().replace(/\D/g, '').length !== 10) {
      // Should have 10 digits after stripping everything else
      error += ': Phone number should be 10 digits';
    }
    if (error) {
      error = `Line ${guest.line}${error}.`;
      errors.push(error);
    }
  });
  if (errors.length) callback(errors);
  else callback();
};

const validateRequiredGuests = (rules, value: Array<Guest> = [], callback) => {
  const errors: Array<String> = [];
  const guestCount = value.filter(
    guest => guest.first_name || guest.last_name || guest.phone
  ).length;
  if (guestCount) callback();
  else callback('Pleased add at least one guest!');
};

type Props = {
  event: Event,
  groups: Array<Group>,
  saving: boolean,
  saveGuests: ({
    eventId: ID,
    guests: Array<Guest>,
    groups: Array<Group>,
  }) => void,
  loadGroups: (eventId: ID) => void,
  form: object,
  history: object,
};

const BulkUpload = (props: Props) => {
  const {
    form,
    history,
    event,
    groups,
    saveGuests,
    loadGroups,
    saving,
  } = props;
  const { getFieldDecorator } = form;
  const fileinput = React.useRef();
  React.useEffect(
    () => {
      if (event && event.id) {
        loadGroups(event.id);
      }
    },
    [(event || {}).id]
  );

  const handleFileLoad = e => {
    props.form.setFields({
      guests: {
        value: stringToGuestArray(e.target.result),
      },
    });
  };

  const handleOnImport = () => {
    const { files } = fileinput.current;
    if (files.length > 0) {
      const file = files[0]; // The file selected by the user
      const fr = new FileReader();

      fr.onload = handleFileLoad;
      fr.readAsText(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const selectedGroups = groups.filter(
          group => group.id in values.groups && !group.is_all
        );
        if (event.id)
          saveGuests({
            eventId: event.id,
            guests: values.guests
              .filter(
                guest =>
                  ((guest.first_name && guest.first_name.trim()) ||
                    (guest.last_name && guest.last_name.trim())) &&
                  guest.phone
              )
              .map(guest => ({
                first_name: (guest.first_name || '').trim(),
                last_name: (guest.last_name || '').trim(),
                phone: `+1${guest.phone.replace(/\D/g, '')}`, // normalize the phone number
              })),
            groups: selectedGroups,
            cb: () => {
              history.push('/dashboard/guests');
            },
          });
      }
    });
  };

  return (
    <LayoutWrapper>
      <PageHeader>
        <span className="title">Bulk Upload Guests</span>
      </PageHeader>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Form.Item {...formItemLayout} label="Import CSV File">
            <div>
              <input
                onChange={handleOnImport}
                type="file"
                accept=".csv, text/plain , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                ref={fileinput}
              />
              <a href="/templates/guests.csv">Download sample CSV file</a>
            </div>
          </Form.Item>
          <Form.Item {...formItemLayout} required label="All guests">
            {getFieldDecorator('guests', {
              initialValue: [],
              getValueFromEvent: e => {
                if (e) {
                  if (e.target) return stringToGuestArray(e.target.value);
                  if (typeof e === 'string') return stringToGuestArray(e);
                  return [];
                }
                return [];
              },
              getValueProps: (value: Array<Guest>): { value: string } => ({
                value: guestArrayToString(value),
              }),
              rules: [
                {
                  validator: validateGuests,
                  type: 'array',
                },
                {
                  validator: validateRequiredGuests,
                  type: 'array',
                },
              ],
            })(
              <ControlTooltip title="One guest per line with the following format: <First Name>, <Last Name>, <Phone>">
                <TextArea autosize={{ minRows: 10 }} />
              </ControlTooltip>
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
                  return Object.assign({}, value, { all: true });
                }
                return value;
              },
              valuePropName: 'selected',
              initialValue: { all: true },
              rules: [
                {
                  type: 'object',
                  validator: (rules, value, callback) => {
                    if (Object.keys(value).length === 0) {
                      callback('Guests must be part of some groups');
                    }
                    callback();
                  },
                },
              ],
            })(
              <ControlTooltip
                align="start"
                title="Quickly assign these imported guests to an existing group. You can always manage groups later if you prefer.">
                <GroupControl groups={groups} />
              </ControlTooltip>
            )}
          </Form.Item>
          <Form.Item {...tailItemLayout}>
            <Link to="/dashboard/guests">
              <Button type="default" style={{ marginRight: '10px' }}>
                Cancel
              </Button>
            </Link>
            <Button
              loading={saving}
              disabled={saving}
              type="primary"
              htmlType="submit">
              Add Guests
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </LayoutWrapper>
  );
};

export default connect(
  state => ({
    saving: state.loading.effects.Guest.bulkUploadGuests,
    groups: store.select.Group.allGroups(state),
    event: store.select.Event.currentEvent(state),
  }),
  ({ Group: { loadGroups }, Guest: { bulkUploadGuests } }) => ({
    saveGuests: bulkUploadGuests,
    loadGroups,
  })
)(Form.create()(BulkUpload));
