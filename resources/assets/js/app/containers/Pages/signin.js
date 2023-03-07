// @flow
import React, { Component } from 'react';
import store from '../../redux/store';
import { Link } from 'react-router-dom';
import { Form, Input } from 'antd';
import { connect } from 'react-redux';
import {
  AuthStyledWrapper,
  AuthContent,
  FormWrapper,
  StyledButton,
} from './auth.style';

type FormProps = {
  form: Object,
  loading: boolean,
  onLogin: (string, string) => void,
};

class LoginBasic extends Component<FormProps> {
  static defaultProps = {
    onLogin: () => null,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { email, password } = values;
        this.props.onLogin(email, password);
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
                // eslint-disable-next-line no-useless-escape
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email address',
                required: true,
              },
            ],
          })(<Input placeholder="Email" />)}
        </Form.Item>
        <Form.Item className="isoInputWrapper">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'This field is required',
              },
            ],
          })(<Input type="password" placeholder="Password" />)}
        </Form.Item>
        <Form.Item>
          <StyledButton
            disabled={loading}
            htmlType="submit"
            loading={loading}
            type="primary">
            Sign In
          </StyledButton>
        </Form.Item>
      </Form>
    );
  }
}

export const LoginForm = Form.create()(LoginBasic);

type Props = {
  login: ({ email: string, password: string, cb: () => void }) => void,
  history: Object,
  loading: boolean,
  inviteToken?: string,
};

class SignIn extends Component<Props> {
  static defaultProps = {
    loading: false,
    isLoggedIn: false,
  };

  handleLogin = (email: string, password: string) => {
    const { login, history } = this.props;
    login({
      email,
      password,
      cb: () => history.push('dashboard'),
    });
  };

  render() {
    return (
      <AuthStyledWrapper className="sign-in">
        <AuthContent>
          <div className="tmg-logo-container">
            <img
              className="white-logo"
              src="/assets/images/live/TMG-Logo-Small.png"
              alt="TextMyGuests logo"
            />
          </div>

          <h1 className="title">Welcome back! Sign in here.</h1>

          <div className="isoHelperWrapper">
            <Link to="/forgot-password" className="isoForgotPass">
              Forgot Password?
            </Link>
            <br />
            <Link to="/signup">Create Account</Link>
          </div>

          <FormWrapper>
            {this.props.inviteToken && (
              <p
                style={{
                  marginBottom: '1rem',
                  color: '#1890ff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>
                To accept the invitation, simply sign in or create an account.
              </p>
            )}
            <LoginForm
              onLogin={this.handleLogin}
              loading={this.props.loading}
            />
          </FormWrapper>
        </AuthContent>
      </AuthStyledWrapper>
    );
  }
}

export default connect(
  state => ({
    loading: state.loading.effects.Auth.login,
    inviteToken: store.select.Auth.inviteToken(state),
  }),
  ({ Auth }) => ({ login: Auth.login })
)(SignIn);
