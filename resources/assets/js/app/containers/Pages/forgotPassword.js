// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from 'antd';
import { connect } from 'react-redux';
import {
  AuthStyledWrapper,
  AuthContent,
  FormWrapper,
  StyledButton,
} from './auth.style';

const ResetLinkSent = (props: { email: string }) => (
  <div style={{ textAlign: 'center' }}>
    <h3>Success!</h3>
    An email was sent to {props.email} with a link to reset your password.
    <div style={{ fontWeight: 600, marginTop: '5px' }}>
      The reset link is only valid for 60 minutes.
    </div>
  </div>
);

type FormProps = {
  form: Object,
  loading: boolean,
  onSubmit: (email: string) => void,
};

class ForgotForm extends Component<FormProps> {
  static defaultProps = {
    onSubmit: () => null,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { email } = values;
        this.props.onSubmit(email);
      }
    });
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit} className="isoSignInForm">
        <Form.Item className="isoInputWrapper">
          {getFieldDecorator('email', {
            rules: [
              {
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                message: 'Please enter a valid email address',
                required: true,
              },
            ],
          })(<Input placeholder="Email" />)}
        </Form.Item>
        <Form.Item>
          <StyledButton
            disabled={loading}
            htmlType="submit"
            loading={loading}
            type="primary">
            Send reset link
          </StyledButton>
        </Form.Item>
      </Form>
    );
  }
}

export const ForgotPasswordForm = Form.create()(ForgotForm);

type Props = {
  sendResetPasswordLink: (email: string) => void,
  loading: boolean,
  reset: {
    success: boolean,
    email: string,
  },
};

class ForgotPassword extends Component<Props> {
  static defaultProps = {
    loading: false,
    isLoggedIn: false,
  };

  render() {
    const { reset } = this.props;
    return (
      <AuthStyledWrapper className="forgot-password">
        <AuthContent>
          <div className="tmg-logo-container">
            <img
              className="white-logo"
              src="/assets/images/live/TMG-Logo-Small.png"
              alt="TextMyGuests logo"
            />
          </div>

          <h1 className="title">Password Recovery</h1>

          <div className="isoHelperWrapper">
            <Link to="/signin" className="isoForgotPass">
              Sign in
            </Link>
            <br />
            <Link to="/signup">Create account</Link>
          </div>

          <FormWrapper className="form-wrapper">
            {reset && reset.success && reset.email ? (
              <ResetLinkSent email={reset.email} />
            ) : (
              <div>
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                  We will send you an email with a link to recover your
                  password.
                </div>
                <ForgotPasswordForm
                  onSubmit={this.props.sendResetPasswordLink}
                  loading={this.props.loading}
                />
              </div>
            )}
            <div className="isoCenterComponent isoHelperWrapper" />
          </FormWrapper>
        </AuthContent>
      </AuthStyledWrapper>
    );
  }
}

export default connect(
  state => ({
    loading: state.loading.effects.Auth.sendResetPasswordLink,
    reset: state.Auth.reset,
  }),
  ({ Auth }) => ({ sendResetPasswordLink: Auth.sendResetPasswordLink })
)(ForgotPassword);
