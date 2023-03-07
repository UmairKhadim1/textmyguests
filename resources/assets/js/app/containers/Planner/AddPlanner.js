import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Row, Col } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  .new-owner {
    display: flex;
    padding: 14px;
    background-color: #fff;
    .input {
      flex: 1 1 auto;
    }
  }
`;
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
function AddPlanner(props) {
  const [validEmail, setEmailValidity] = useState(false);
  const [isPlanner, setIsPlanner] = useState(true);
  const [email, setEmail] = useState('');

  const handleEmailChange = e => {
    const { value = '' } = e.target;
    const valid = emailRegex.test(value.trim().toLowerCase());
    setEmail(value.trim().toLowerCase());
    setEmailValidity(valid);
  };

  const handleInviteClick = e => {
    e.preventDefault();
    props.submitHandler(email, isPlanner);
  };

  useEffect(
    () => {
      if (!props.visible) {
        setEmail('');
      }
    },
    [props.visible]
  );
  return (
    <div>
      <Wrapper>
        <Row>
          <Col lg={{ span: 18, offset: 3 }}>
            <Form onSubmit={handleInviteClick}>
              <div style={{ display: 'inline' }}>
                <Input
                  value={email}
                  onChange={handleEmailChange}
                  className="input"
                  placeholder="Enter an email address"
                />
                <Form.Item wrapperCol={{ offset: 19, span: 5 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!validEmail}>
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Col>
        </Row>
      </Wrapper>
    </div>
  );
}

export default AddPlanner;
