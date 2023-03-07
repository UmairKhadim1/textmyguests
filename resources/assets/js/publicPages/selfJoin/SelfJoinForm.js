import React from 'react';
import { Button, Input, Form } from 'antd';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
// import { validatePhoneNumber } from '../../app/containers/Guest/editGuest';
import styled from 'styled-components';

const StyledForm = styled(Form)`
  .ant-form-item {
    @media only screen and (min-width: 576px) {
      display: flex;
    }

    .ant-form-item-label {
      font-size: 1rem;
      font-weight: 600;
      line-height: 38px;
      label::before {
        content: '';
      }
    }

    .ant-form-item-control-wrapper {
      flex-grow: 1;
    }
  }

  .button-container {
    text-align: center;

    button {
      font-size: 1rem;
      min-width: 100px;
    }
  }
`;
export const validatePhoneNumber = (rule, value, callback) => {
  // We don't need to validate an empty value.
  // There is another validator for it and we don't want to display
  // 2 error messages at the same time.
  if (!value) {
    callback();
    return;
  }
  const phoneNumber = parsePhoneNumberFromString(value, 'US');

  if (!phoneNumber || !phoneNumber.isValid()) {
    callback('You must enter a valid phone number.');
    return;
  }

  if (phoneNumber.country !== 'US' && phoneNumber.country !== 'CA') {
    callback('You must enter a phone number from United States or Canada.');
    return;
  }

  callback();
};

type Props = {
  form: Object,
  handleSubmit: (values: {
    firstname: string,
    lastname: string,
    phone: string,
  }) => void,
  submitting: boolean,
};

const EditGuest = (props: Props) => {
  const { form } = props;

  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      // console.log(values);
      if (!err) {
        // Format the phone number to '+1**********' where * is a number
        const phoneNumber = parsePhoneNumberFromString(values.phone, 'US');
        const formattedPhoneNumber = phoneNumber.format('E.164');

        values.phone = formattedPhoneNumber;
        props.handleSubmit(values);
      }
    });
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Form.Item label="First Name">
        {getFieldDecorator('firstname', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'You must enter your first name.',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Last Name">
        {getFieldDecorator('lastname', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'You must enter your last name.',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Phone Number">
        {getFieldDecorator('phone', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'The phone number is required',
            },
            {
              validator: validatePhoneNumber,
            },
          ],
          normalize: (value, prevValue) => {
            if (
              value &&
              prevValue &&
              value.length &&
              value.length === 4 &&
              prevValue.length === 5
            ) {
              // return value.slice(1, 3);
              // console.log(value);
            }

            return new AsYouType('US').input(value);
          },
        })(<Input addonBefore="+1" />)}
      </Form.Item>

      <Form.Item className="button-container">
        <Button
          disabled={props.submitting}
          type="primary"
          loading={props.submitting}
          htmlType="submit">
          Join
        </Button>
      </Form.Item>
    </StyledForm>
  );
};

export default Form.create()(EditGuest);
