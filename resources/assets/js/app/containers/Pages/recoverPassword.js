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
import { RouteComponentProps } from 'react-router-dom';

const PasswordResetSuccess = () => (
  <div style={{ textAlign: 'center' }}>
    <h3>Password was succesfully changed</h3>
    You can now sign in with your new password.
  </div>
);

type FormProps = {
  form: Object,
  loading: boolean,
  onSubmit: (newPassword: string, newPasswordConfirmation: string) => void,
};

class RecoverForm extends Component<FormProps> {
  static defaultProps = {
    onSubmit: () => null,
  };

  validatePasswordConfirmation = (rule, value, callback) => {
    const newPassword = this.props.form.getFieldValue('newPassword');

    if (value !== newPassword) {
      callback("Passwords don't match");
    }

    callback();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { newPassword, newPasswordConfirmation } = values;
        this.props.onSubmit(newPassword, newPasswordConfirmation);
      }
    });
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit} className="isoSignInForm">
        <Form.Item className="isoInputWrapper">
          {getFieldDecorator('newPassword', {
            rules: [
              {
                min: 8,
                message: '8 characters at least',
              },
              {
                required: true,
                message: 'This field is required',
              },
            ],
          })(<Input type="password" placeholder="New password" />)}
        </Form.Item>
        <Form.Item className="isoInputWrapper">
          {getFieldDecorator('newPasswordConfirmation', {
            rules: [
              {
                required: true,
                message: 'This field is required',
              },
              {
                validator: this.validatePasswordConfirmation,
              },
            ],
          })(<Input type="password" placeholder="Confirm new password" />)}
        </Form.Item>
        <Form.Item>
          <StyledButton
            disabled={loading}
            htmlType="submit"
            loading={loading}
            type="primary">
            Reset my password
          </StyledButton>
        </Form.Item>
      </Form>
    );
  }
}

export const RecoverPasswordForm = Form.create()(RecoverForm);

interface Props extends RouteComponentProps<{ token: string }> {
  recoverPassword: (
    token: string,
    encryptedEmail: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) => void;
  loading: boolean;
  passwordRecovered: boolean;
}

class ForgotPassword extends Component<Props> {
  static defaultProps = {
    loading: false,
    isLoggedIn: false,
  };

  handleSubmit(newPassword: string, newPasswordConfirmation: string) {
    const token = this.props.match.params.token;
    const encryptedEmail = this.props.match.params.encryptedEmail;
    if (token) {
      this.props.recoverPassword({
        token,
        encryptedEmail,
        newPassword,
        newPasswordConfirmation,
      });
    }
  }

  render() {
    const { passwordRecovered } = this.props;
    return (
      <AuthStyledWrapper className="recover-password">
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
            {passwordRecovered ? (
              <PasswordResetSuccess />
            ) : (
              <RecoverPasswordForm
                onSubmit={this.handleSubmit.bind(this)}
                loading={this.props.loading}
              />
            )}
          </FormWrapper>
        </AuthContent>
      </AuthStyledWrapper>
    );
  }
}

export default connect(
  state => ({
    loading: state.loading.effects.Auth.recoverPassword,
    passwordRecovered: state.Auth.passwordRecovered,
  }),
  ({ Auth }) => ({ recoverPassword: Auth.recoverPassword })
)(ForgotPassword);
