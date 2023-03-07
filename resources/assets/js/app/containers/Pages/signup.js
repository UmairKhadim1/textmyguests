// @flow
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Input, Select, Modal, Button, Row, Col } from 'antd';
import ReactPixel from '../../components/pixel/FacebookPixel';
import ReactGA from '../../components/pixel/ReactGA';
import ReactPinterestTag from '../../components/pixel/PinterestPixel';
import OtpInput from 'react-otp-input';
import {
  AuthStyledWrapper,
  AuthContent,
  FormWrapper,
  StyledButton,
} from './auth.style';
import Switch from '../../components/uielements/switch';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import HearAboutUs from './HearAboutUs.json';
import BusinessType from './BusinessType.json';
import { formItemLayout, tailItemLayout } from '../../components/form/layout';
import ControlTooltip from '../../components/form/ControlTooltip';
import OtpPopUp from './OtpPopUp';
import './VerifyOtp.css';
import './signup.css';
import notification from '../../components/feedback/notification';

const AboutUs = Object.keys(HearAboutUs).map(AU => ({
  about: AU,
  text: HearAboutUs[AU],
}));

const BusinessTypeValue = Object.keys(BusinessType).map(bt => ({
  type: bt,
  text: BusinessType[bt],
}));
type Props = {
  loading: boolean,
  form: Object,
  register: ({
    user: Object,
    cb: () => void,
  }) => void,
  SendOtp: {
    phone: String,
  },
  UserVerificationOtp: {
    phone: String,
    otp: String,
  },
  history: Object,
};

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

const SignUp = (props: Props) => {
  const { form, SendOtp, UserVerificationOtp } = props;
  const [professional, setProfessional] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessError, setBusinessError] = useState(false);
  const [type, setType] = useState('');
  const [typeError, setTypeError] = useState(false);
  const [websiteURL, setWebsiteURL] = useState('');
  const [websiteError, setWebsiteError] = useState(false);
  const [websiteIsValid, setWebsiteIsValid] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [isValidNum, setIsValidNum] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [optErr, setOtpErr] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const businesshandler = e => {
    setBusinessName(e.target.value);
    if (e.target.value.length < 3) {
      setBusinessError(true);
    } else {
      setBusinessError(false);
    }
  };
  // const sendOtp = () => {
  //   console.log('send otp');
  //   // props.SendOtp({ phone });
  // };
  const handleOkay = () => {
    setIsModalVisible(false);
  };
  const typehandler = e => {
    setType(e);
    setTypeError(false);
    // setType(e.target.value);
    // if (e.target.value.length < 3) {
    //   setTypeError(true);
    // } else {
    //   setTypeError(false);
    // }
    // console.log(e);
  };
  const websitehandler = e => {
    setWebsiteURL(e.target.value);
    if (e.target.value.length < 10) {
      setWebsiteError(true);
    } else {
      setWebsiteError(false);
    }
    setWebsiteIsValid(!urlPatternValidation(e.target.value));
    // console.log(urlPatternValidation(e.target.value));
  };
  const urlPatternValidation = URL => {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    return regex.test(URL);
  };

  useEffect(() => {});

  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const handleSubmit = async e => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          firstName,
          lastName,
          phone,
          email,
          password,
          passwordConfirmation,
          userSource,
        } = values;
        if (professional) {
          if (type.length < 1) {
            setTypeError(true);
            return;
          }
          if (businessName.length < 3) {
            setBusinessError(true);
            return;
          }
          if (websiteURL.length < 3) {
            // console.log('ERROR');
            setWebsiteError(true);
            return;
          } else if (!urlPatternValidation(websiteURL)) {
            setWebsiteIsValid(true);
            return;
          }
        }
        if (!isVerified) {
          setIsModalVisible(true);
          return;
        }
        const isProfessional = professional;
        const typeOfBusiness = type;
        const businessname = businessName;
        const website = websiteURL;
        // Format the phone number to '+1**********' where * is a number
        const phoneNumber = parsePhoneNumberFromString(phone, 'US');
        const formattedPhoneNumber = phoneNumber.format('E.164');
        let user = {};
        if (isProfessional) {
          confirm({
            content: (
              <div>
                <h2>Welcome to the TextMyGuests partnership program!</h2>
                <p>
                  As a wedding industry professional, you have access to
                  exclusive discounts and deals that will help keep your events
                  on track. Benefits include:
                </p>
                <ul>
                  <li>First event is FREE</li>
                  <li>40% off regular pricing for all other events</li>
                  <li>And, dedicated account support</li>
                </ul>
                <p>We look forward to working with you! </p>
              </div>
            ),
            okText: `Let's Get Started`,
            cancelText: 'No',
            cancelButtonProps: { style: { display: 'none' } },
            onOk() {
              // console.log('OK');
              registerUser({
                firstName,
                lastName,
                phone: formattedPhoneNumber,
                email,
                password,
                passwordConfirmation,
                userSource,
                typeOfBusiness,
                isProfessional,
                businessname,
                website,
                partnership: true,
              });
            },
            // onCancel() {
            //   console.log('Cancel');
            //   registerUser({
            //     firstName,
            //     lastName,
            //     phone: formattedPhoneNumber,
            //     email,
            //     password,
            //     passwordConfirmation,
            //     userSource,
            //     typeOfBusiness,
            //     isProfessional,
            //     businessname,
            //     website,
            //     partnership: false,
            //   });
            // },
          });
        } else {
          registerUser({
            firstName,
            lastName,
            phone: formattedPhoneNumber,
            email,
            password,
            passwordConfirmation,
            userSource,
            typeOfBusiness,
            isProfessional,
            businessname,
            website,
            partnership: true,
          });
        }
      }
    });
  };
  const handleChange = otp => setOtp(otp);

  const sendOtp = async e => {
    e.preventDefault();
    setVerificationLoading(true);
    try {
      const response = await SendOtp({ phone: phoneNum });
      console.log(response);
      if (response) {
        setVisibility(true);
      }
    } catch (err) {
      console.log(err);
    }
    setVerificationLoading(false);
  };
  const handlePhoneNum = e => {
    const phonenumber = parsePhoneNumberFromString(e.target.value, 'US');
    if (phonenumber && phonenumber.isValid()) {
      setIsValidNum(true);
      setPhoneNum(phonenumber.number);
    }
  };
  const verifyOtp = async e => {
    e.preventDefault();
    console.log('verifyOtp');
    if (otp.length < 4) {
      setOtpErr(true);
    } else {
      setOtpLoading(true);
      try {
        const response = await UserVerificationOtp({ phone: phoneNum, otp });
        console.log(response);
        if (response) {
          setIsVerified(true);
          setVisibility(false);
        }
      } catch (err) {
        console.log(err);
      }
      setOtpLoading(false);
    }
  };

  const registerUser = user => {
    // console.log(user);
    props.register({
      user,
      cb: () => {
        //Pinterest Pixel
        ReactPinterestTag.track('signup', {
          event_time: new Date().toISOString(),
          evemt_name: 'New User Created',
        });
        //Facebook Pixel
        ReactPixel.track('CompleteRegistration', {});
        //Google Analytics
        ReactGA.event({
          category: 'SignUp',
          action: 'UserSignUp',
        });
        props.history.push('dashboard');
      },
    });
  };
  const handleProfessional = e => {
    setProfessional(!professional);
    // console.log('professional value', e);
  };
  const popupCloseHandler = e => {
    setVisibility(e);
  };
  const handlePhone = e => {
    console.log(e);
    setVisibility(true);
  };
  return (
    <>
      <AuthStyledWrapper className="sign-up">
        <AuthContent>
          <div className="tmg-logo-container">
            <img
              className="white-logo"
              src="/assets/images/live/TMG-Logo-Small.png"
              alt="TextMyGuests logo"
            />
          </div>

          <h1 className="title">
            You are seconds away from your 100% free trial of TextMyGuests.
            <br />
            No credit card required.
          </h1>

          <div className="isoHelperWrapper">
            <Link to="/signin">Already have an account? Sign in.</Link>
          </div>

          <FormWrapper>
            <Form onSubmit={handleSubmit}>
              <div className="names-inputs">
                <Form.Item className="isoInputWrapper">
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        required: true,
                        message: 'Your first name is required',
                      },
                    ],
                  })(<Input placeholder="First Name" />)}
                </Form.Item>

                <Form.Item className="isoInputWrapper">
                  {getFieldDecorator('lastName', {
                    rules: [
                      {
                        required: true,
                        message: 'Your last name is required',
                      },
                    ],
                  })(<Input placeholder="Last Name" />)}
                </Form.Item>
              </div>
              <Row>
                <Col span={19}>
                  <Form.Item className="isoInputWrapper">
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
                        if (value.length === 4 && prevValue.length === 5) {
                          return value.slice(1, 3);
                        }

                        return new AsYouType('US').input(value);
                      },
                    })(
                      // <Row>
                      //   <Col span={17}>
                      <Input
                        placeholder="Phone Number"
                        addonBefore="+1"
                        onChange={e => handlePhoneNum(e)}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Button
                    type="primary"
                    onClick={e => sendOtp(e)}
                    disabled={!isValidNum || isVerified}
                    loading={verificationLoading}>
                    Verify
                  </Button>
                </Col>
              </Row>

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
                      min: 8,
                      message: '8 characters at least',
                    },
                    {
                      required: true,
                      message: 'This field is required',
                    },
                  ],
                })(<Input type="password" placeholder="Password" />)}
              </Form.Item>

              <Form.Item className="isoInputWrapper">
                {getFieldDecorator('passwordConfirmation', {
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
                })(<Input type="password" placeholder="Confirm Password" />)}
              </Form.Item>
              <Form.Item className="isoInputWrapper">
                {getFieldDecorator('userSource', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: 'Please tell us where did you hear about us',
                    },
                  ],
                })(
                  <Select>
                    <Select.Option value="" disabled selected>
                      Where did you hear about us?
                    </Select.Option>
                    {AboutUs.map(aboutus => (
                      <Select.Option value={aboutus.about}>
                        {aboutus.text}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('isProfessional', {
                  initialValue: false,
                })(
                  <div
                    className="professional_wrapper"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                    <label>Are you a Wedding Professional?</label>
                    <Switch
                      checked={professional}
                      className="professional_toggle"
                      onClick={handleProfessional}
                    />
                  </div>
                )}
              </Form.Item>
              <Form.Item
                className="isoInputWrapper"
                style={!professional ? { display: 'none' } : ''}>
                <>
                  <Select
                    // placeholder="Business Type"
                    value={type}
                    onChange={typehandler}>
                    <Select.Option value="" disabled selected>
                      Select Business Type
                    </Select.Option>
                    {BusinessTypeValue.map(btv => (
                      <Select.Option value={btv.type}>{btv.text}</Select.Option>
                    ))}
                  </Select>
                  {typeError ? (
                    <p className="danger-text">The Business type is required</p>
                  ) : (
                    ''
                  )}
                </>
              </Form.Item>
              <Form.Item
                className="isoInputWrapper"
                style={!professional ? { display: 'none' } : ''}>
                <>
                  <Input
                    placeholder="Business Name"
                    value={businessName}
                    onChange={businesshandler}
                  />
                  {businessError ? (
                    <p className="danger-text">
                      Business name can not less than 3 characters
                    </p>
                  ) : (
                    ''
                  )}
                </>
              </Form.Item>

              <Form.Item
                className="isoInputWrapper"
                style={!professional ? { display: 'none' } : ''}>
                <>
                  <Input
                    placeholder="Website"
                    value={websiteURL}
                    onChange={websitehandler}
                  />
                  {websiteError ? (
                    <p className="danger-text">
                      Website url can not less than 10 characters
                    </p>
                  ) : websiteIsValid ? (
                    <p className="danger-text">Website url is not valid</p>
                  ) : (
                    ''
                  )}
                </>
              </Form.Item>

              <Form.Item>
                <StyledButton
                  htmlType="submit"
                  loading={props.loading}
                  type="primary">
                  Go to your Free Account
                </StyledButton>
              </Form.Item>
            </Form>
          </FormWrapper>
        </AuthContent>
      </AuthStyledWrapper>
      <OtpPopUp
        onClose={popupCloseHandler}
        show={visibility}
        title="Phone Number Verification">
        <h4 style={{ fontSize: '20px', textAlign: 'center' }}>
          Enter the OTP that we have sent to <br />
          your number <span style={{ color: 'green' }}> {phoneNum}</span>
        </h4>
        <FormWrapper>
          <div className="verifyotp_wrapper">
            <Form className="isoSignInForm" onSubmit={verifyOtp}>
              <Form.Item className="isoInputWrapper d-flex justify-content-center">
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={4}
                  isInputNum={true}
                  separator={<span> </span>}
                  className="verify_input_wrapper"
                  inputStyle="verify_input"
                />
                {optErr ? (
                  <p
                    style={{
                      color: 'red',
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '0px',
                      marginTop: '0px',
                    }}>
                    OTP must contain atleast 4 characters
                  </p>
                ) : (
                  ''
                )}
              </Form.Item>
              <Form.Item>
                <StyledButton
                  disabled={otpLoading}
                  htmlType="submit"
                  loading={otpLoading}
                  type="primary">
                  Continue
                </StyledButton>
              </Form.Item>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '17px',
                }}>
                Didn't receive OTP?
                <Link
                  to="/verify-otp"
                  onClick={e => sendOtp(e)}
                  style={{ color: 'green', paddingLeft: '5px' }}>
                  Resend OTP
                </Link>
              </span>
            </Form>
          </div>
        </FormWrapper>
      </OtpPopUp>
      <Modal
        title="Verify Phone Number"
        visible={isModalVisible}
        onOk={handleOkay}
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>Please verify your phone number before creating your account</p>
      </Modal>
    </>
  );
};

export default connect(
  state => ({
    loading: state.loading.effects.Auth.register,
  }),
  ({ Auth }) => ({
    register: Auth.register,
    SendOtp: Auth.SendOtp,
    UserVerificationOtp: Auth.UserVerificationOtp,
  })
)(Form.create({ name: 'register' })(SignUp));
