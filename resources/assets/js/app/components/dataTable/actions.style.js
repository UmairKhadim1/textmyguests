import styled from 'styled-components';

const ActionsWrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-block;

    & > * {
      margin-right: 4px;
    }
  }
`;

export default ActionsWrapper;
