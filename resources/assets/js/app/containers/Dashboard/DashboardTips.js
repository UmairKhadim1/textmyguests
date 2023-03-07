/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Collapse } from 'antd';
import { faq } from './faqData';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const { Panel } = Collapse;

const DashboardTipsWrapper = styled.div`
  .ant-collapse {
    background-color: transparent;
  }
`;
const AnswerWrapper = styled.div`
  display: flex;
  padding-right: 24px;
  text-align: justify;

  > p {
    flex-grow: 1;
    line-height: 1.65;
  }

  .help-icon {
    margin-right: 10px;
  }
`;

const StyledPanelHeader = styled.div`
  display: flex;
  .help-icon {
    margin-right: 10px;
    opacity: ${props => (props.isActive ? 1 : 0.25)};
    color: ${props =>
      props.isActive ? props.theme.palette.primary[0] : 'inherit'};
  }
  > div {
    flex-grow: 1;
    font-weight: ${props => (props.isActive ? '600' : '400')};
  }
`;

const panelStyles = {
  backgroundColor: '#fff',
  border: 0,
  bordeRadius: 0,
  marginBottom: '2px',
  overflow: 'hidden',
};

const PanelHeader = ({
  question,
  isActive,
}: {
  question: string,
  isActive: boolean,
}) => (
  <StyledPanelHeader isActive={isActive}>
    <i className="ion-help-circled help-icon" />
    <div>{question}</div>
  </StyledPanelHeader>
);

const DashboardTips = () => {
  const [activePanel, changeActivePanel] = useState(null);

  const onChange = value => {
    changeActivePanel(value);
  };

  return (
    <DashboardTipsWrapper>
      <h2 style={{ marginBottom: '12px' }}>Tips to get you started:</h2>
      <Collapse
        accordion
        onChange={onChange}
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <div style={{ fontSize: '14px' }}>
            {isActive ? (
              <i className="ion-chevron-up" />
            ) : (
              <i className="ion-chevron-down" />
            )}
          </div>
        )}>
        {faq.map((data, i) => (
          <Panel
            header={
              <PanelHeader
                isActive={parseInt(activePanel) === i}
                question={data.question}
              />
            }
            key={i}
            style={panelStyles}>
            <AnswerWrapper>
              <p>{data.answer}</p>
            </AnswerWrapper>
          </Panel>
        ))}
      </Collapse>
    </DashboardTipsWrapper>
  );
};

export default DashboardTips;
