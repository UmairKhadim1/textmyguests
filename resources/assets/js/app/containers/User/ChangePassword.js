// @flow
import React from 'react';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { tailItemLayout } from '../../components/form/layout';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 10 },
    lg: { span: 9 },
  },
};

type Props = {
  form: Object,
  updatePassword: ({
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
  }) => void,
};

class ChangePasswordForm extends React.Component<Props> {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.updatePassword(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="Old Password">
          {getFieldDecorator('oldPassword', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'Required',
              },
            ],
          })(
            <Input.Password
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="New Password">
          {getFieldDecorator('newPassword', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'Required',
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Password Confirmation">
          {getFieldDecorator('newPasswordConfirmation', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'Required',
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item {...tailItemLayout}>
          <Button htmlType="submit" loading={this.props.loading} type="primary">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(
  state => ({
    loading: state.loading.effects.Auth.updatePassword,
  }),
  ({ Auth: { updatePassword } }) => ({
    updatePassword,
  })
)(Form.create()(ChangePasswordForm));
