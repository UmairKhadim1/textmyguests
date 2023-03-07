import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '../../app/config/style-util';
import WithDirection from '../../app/config/withDirection';

const TopbarWrapper = styled.div`
  .isomorphicTopbar {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0px 31px;
    z-index: 1000;
    ${transition()};

    @media only screen and (max-width: 576px) {
      padding: 0px 17px;
    }

    &.collapsed {
      padding: 0px 31px;
      @media only screen and (max-width: 767px) {
        padding: ${props =>
          props['data-rtl'] === 'rtl'
            ? '0px 15px !important'
            : '0px 15px !important'};
      }
    }

    .isoLeft {
      display: flex;
      align-items: center;

      @media only screen and (max-width: 767px) {
        margin: ${props =>
          props['data-rtl'] === 'rtl' ? '0 0 0 15px' : '0 15px 0 0'};
      }

      .triggerBtn {
        width: 24px;
        height: 100%;
        display: -webkit-inline-flex;
        display: -ms-inline-flex;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: 0;
        outline: 0;
        position: relative;
        cursor: pointer;

        &:before {
          content: '\f20e';
          font-family: 'Ionicons';
          font-size: 26px;
          color: inherit;
          line-height: 0;
          position: absolute;
        }
      }
    }

    .isoRight {
      display: flex;
      align-items: center;
      margin-left: auto;

      li {
        margin-left: ${props => (props['data-rtl'] === 'rtl' ? '35px' : '0')};
        margin-right: ${props => (props['data-rtl'] === 'rtl' ? '0' : '35px')};
        cursor: pointer;
        line-height: normal;
        position: relative;
        display: inline-block;

        @media only screen and (max-width: 360px) {
          margin-left: ${props => (props['data-rtl'] === 'rtl' ? '25px' : '0')};
          margin-right: ${props =>
            props['data-rtl'] === 'rtl' ? '0' : '25px'};
        }

        &:last-child {
          margin: 0;
        }

        i {
          font-size: 24px;
          color: ${palette('text', 0)};
          line-height: 1;
        }
      }
    }

    .nav {
      a {
        font-size: 16px;
        font-weight: bold;
        color: ${palette('text', 0)};
      }
    }
  }
`;

export default WithDirection(TopbarWrapper);
