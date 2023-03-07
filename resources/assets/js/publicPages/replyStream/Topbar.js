import React from 'react';
import { Layout } from 'antd';
import TopbarWrapper from './topbar.style';
import styled from 'styled-components';
import Button from '../../app/components/uielements/button';

const { Header } = Layout;

const LogoContainer = styled.a`
  img {
    height: 40px;
  }

  @media only screen and (max-width: 767px) {
    img {
      height: 32px;
    }
  }

  @media only screen and (max-width: 350px) {
    img {
      height: 28px;
    }
  }
`;

const Logo = () => (
  <LogoContainer href="https://textmyguests.com">
    <img src="/assets/images/live/TMG-Logo-Small.png" alt="TextMyGuests" />
  </LogoContainer>
);

const LinkContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  a:hover {
    text-decoration: underline;
  }

  @media only screen and (max-width: 767px) {
    .remove-on-mobile {
      display: none;
    }

    button {
      padding: 0px 12px !important;
    }
  }
`;

const Topbar = () => {
  const styling = {
    position: 'fixed',
    width: '100%',
    height: 70,
  };

  return (
    <TopbarWrapper>
      <Header style={styling} className="isomorphicTopbar">
        <div className="isoLeft">
          <Logo />
        </div>
        <LinkContainer className="isoRight nav">
          <a href="https://textmyguests.com">
            <Button type="primary">
              Get TextMyGuests
              <span className="remove-on-mobile">&nbsp;for your event!</span>
            </Button>
          </a>
        </LinkContainer>
      </Header>
    </TopbarWrapper>
  );
};

export default Topbar;
