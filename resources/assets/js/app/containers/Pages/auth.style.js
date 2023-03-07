import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '../../config/withDirection';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.palette.color[2]};

  &:hover,
  &:focus {
    opacity: 0.9;
    background-color: ${({ theme }) => theme.palette.color[2]};
  }
`;

export const AuthWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #fafcff;
  background-image: url(/assets/images/bg6.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &.sign-in .isoHelperWrapper,
  &.forgot-password .isoHelperWrapper,
  &.recover-password .isoHelperWrapper {
    margin: 6px 0 20px;
  }

  @media only screen and (min-width: 500px) {
    &.forgot-password .form-wrapper,
    &.recover-password .form-wrapper {
      min-width: 400px;
    }
  }
`;

export const AuthContent = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 30px;
  position: relative;

  .tmg-logo-container {
    margin-bottom: 0.75rem;
    img {
      width: 140px;
      height: auto;
    }
  }

  .title {
    text-align: center;
    font-size: 2.5em;
    max-width: 600px;
  }

  .isoHelperWrapper {
    margin: 20px 0 24px;
    text-align: center;
  }

  @media only screen and (max-width: 499px) {
    width: 100%;
    padding: 40px 20px;

    .tmg-logo-container {
      margin-bottom: 0.35rem;
      img {
        width: 135px;
        height: auto;
      }
    }

    .title {
      text-align: center;
      font-size: 1.75em;
    }

    .isoHelperWrapper {
      margin: 12px 0 12px;
    }
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 550px;

  form {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    .ant-form-item {
      margin-bottom: 1rem;

      input {
        height: 40px;
        padding: 6px 11px;
        font-size: 16px;
        color: black;
      }
    }

    .names-inputs {
      display: flex;

      > div {
        flex-grow: 1;
        &:last-child {
          margin-left: 1rem;
        }
      }
    }

    .isoInputWrapper {
      input {
        &::-webkit-input-placeholder {
          color: ${palette('grayscale', 0)};
        }

        &:-moz-placeholder {
          color: ${palette('grayscale', 0)};
        }

        &::-moz-placeholder {
          color: ${palette('grayscale', 0)};
        }
        &:-ms-input-placeholder {
          color: ${palette('grayscale', 0)};
        }
      }
    }

    button {
      font-weight: 500;
      width: 100%;
      height: 42px;
      border: 0;
    }
  }
`;

export const AuthStyledWrapper = WithDirection(AuthWrapper);
