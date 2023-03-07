// @flow
import React from 'react';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';
import {
  responsiveFormItemLayout,
  tailItemLayout,
} from '../../components/form/layout';
import store from '../../redux/store';

type Props = {
  form: Object,
  first_name: string,
  last_name: string,
  email: string,
  me: () => void,
  updateBasicInfo: ({
    firstName: string,
    lastName: string,
    email: string,
  }) => void,
  submitting: boolean,
};

class BasicInfoForm extends React.Component<Props> {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.updateBasicInfo(values);
      }
    });
  };

  componentDidMount() {
    this.props.me();
  }

  render() {
    const { form, first_name, last_name, email } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...responsiveFormItemLayout} label="First Name">
          {getFieldDecorator('firstName', {
            initialValue: first_name,
            rules: [
              {
                required: true,
                message: 'You cannot have an account without a name',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...responsiveFormItemLayout} label="Last Name">
          {getFieldDecorator('lastName', {
            initialValue: last_name,
            rules: [
              {
                required: true,
                message: 'You cannot have an account without a name',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...responsiveFormItemLayout} label="Email">
          {getFieldDecorator('email', {
            initialValue: email,
            rules: [
              {
                required: true,
                message: 'The email is required',
              },
            ],
          })(<Input disabled={true} />)}
        </Form.Item>
        <Form.Item {...tailItemLayout}>
          <Button
            htmlType="submit"
            loading={this.props.submitting}
            type="primary">
            Update Account Info
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(
  state => {
    const user = store.select.Auth.user(state);
    return {
      ...user,
      submitting: state.loading.effects.Auth.updateBasicInfo,
    };
  },
  ({ Auth: { me, updateBasicInfo } }) => ({
    me,
    updateBasicInfo,
  })
)(Form.create()(BasicInfoForm));
