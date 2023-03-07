import React from 'react';
import { formItemLayout, tailItemLayout } from '../../components/form/layout';
import { Button, Input, Form } from 'antd';
import ControlTooltip from '../../components/form/ControlTooltip';

type Props = {
  form: Object,
  loading: boolean,
  sendMessage: (subject: string, message: string) => void,
};

const ContactForm: React.FC = (props: Props) => {
  const { getFieldDecorator, validateFieldsAndScroll } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.sendMessage(values.subject, values.message);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item {...formItemLayout} label="Subject">
        {getFieldDecorator('subject', {
          rules: [
            {
              required: true,
              message: 'Your message needs a subject',
            },
            {
              max: 100,
              message: 'Your subject cannot exceed 100 characters',
            },
          ],
        })(
          <ControlTooltip title="The subject of your message">
            <Input />
          </ControlTooltip>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Message">
        {getFieldDecorator('message', {
          rules: [
            {
              required: true,
              message: 'You must have a message to send.',
            },
            {
              max: 4000,
              message: 'Your subject cannot exceed 4000 characters',
            },
          ],
        })(
          <ControlTooltip
            align="start"
            title="The message you want to send us.">
            <Input.TextArea rows={5} />
          </ControlTooltip>
        )}
      </Form.Item>
      <Form.Item {...tailItemLayout}>
        <Button
          loading={props.loading}
          disabled={props.loading}
          htmlType="submit"
          type="primary">
          Send message
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(ContactForm);
