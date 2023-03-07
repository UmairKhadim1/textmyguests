/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import FourZeroFourStyleWrapper from '../app/containers/Pages/404.style';
import { siteConfig } from '../app/config';

const FourZeroFour = () => (
  <FourZeroFourStyleWrapper className="iso404Page">
    <div className="iso404Content">
      <h1>404</h1>
      <h3>Looks like you got lost</h3>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href={siteConfig.siteUrl}>Back home</a>
    </div>

    <div className="iso404Artwork">
      <img alt="#" src="/images/rob.png" />
    </div>
  </FourZeroFourStyleWrapper>
);

export default FourZeroFour;
