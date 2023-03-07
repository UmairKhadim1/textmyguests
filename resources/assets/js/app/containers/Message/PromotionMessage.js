import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Promotion = styled.div`
  font-size: 15px;
  padding: 1.25rem 1.5rem;
  background: #fff;
  box-shadow: -3px 3px 12px -4px rgba(0, 0, 0, 0.1);
  .title {
    font-size: 18px;
    color: ${({ theme }) => theme.palette.color[2]}; /* pink */
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .more-info {
    margin-left: 0.5rem;
    font-size: 0.95em;

    .icon {
      margin-left: 0.25rem;
      vertical-align: middle;
    }

    :hover {
      text-decoration: underline;
    }
  }
`;

const PromotionMessage: React.FC = () => (
  <Promotion>
    <h4 className="title">Get $50 off!</h4>
    Let your guests know you used TextMyGuests.com and we will give you $50!
    <Link to="/dashboard/promotion" className="more-info">
      Get more info
      <i className="ion-ios-arrow-forward icon" />
    </Link>
  </Promotion>
);

export default PromotionMessage;
