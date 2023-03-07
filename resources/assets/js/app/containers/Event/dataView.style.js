import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  .count-box {
    width: 100%;
    background-color: #eee;
    color: #fff;
    text-align: center;
    padding: 20px;
  }

  .count {
    color: #fff;
    font-size: 36px;
  }

  .item-type {
    font-size: 18px;
    font-weight: 500;
  }
`;

export default Wrapper;
