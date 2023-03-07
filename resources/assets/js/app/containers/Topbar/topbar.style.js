import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '../../config/style-util';
import WithDirection from '../../config/withDirection';

const TopbarWrapper = styled.div`
  .isomorphicTopbar {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 31px;
    z-index: 1000;
    ${transition()};

    @media only screen and (max-width: 767px) {
      padding: 0px 20px !important;
    }

    &.collapsed {
      padding: 0 31px 0 109px;
      @media only screen and (max-width: 767px) {
        padding: 0px 15px !important;
      }
    }

    .isoRight {
      display: flex;
      align-items: center;
      margin-left: auto;
      padding-left: 0;

      li {
        margin-left: 0;
        margin-right: 35px;
        cursor: pointer;
        line-height: normal;
        position: relative;
        display: inline-block;

        &:last-child {
          margin: 0;
        }

        i {
          font-size: 24px;
          color: ${palette('text', 0)};
          line-height: 1;
        }

        .log-out-icon {
          display: none;
          margin-right: 20px;
          i {
            cursor: pointer;
          }
        }

        @media only screen and (max-width: 767px) {
          margin-left: 0;
          margin-right: 25px;
        }

        @media only screen and (max-width: 767px) {
          .log-out-button {
            display: none;
          }
          .log-out-icon {
            display: initial;
          }
        }
      }

      &.dropdown-menu {
        display: none;
        padding-top: 3px;

        .user-icon {
          font-size: 25px;
          margin-right: 4px;
        }
      }

      @media only screen and (max-width: 767px) {
        &.dropdown-menu {
          display: initial;
        }

        &.nav {
          display: none;
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

    .isoLeft {
      display: none;

      @media only screen and (max-width: 767px) {
        display: flex;
        align-items: center;

        .menu-icon {
          font-size: 30px;
        }
      }
    }
  }
`;

export default WithDirection(TopbarWrapper);
