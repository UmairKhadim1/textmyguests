import styled from 'styled-components';

export default styled.div`
  text-align: center;
  font-size: 16px;
  .title {
    font-size: 32px;
    color: ${({ theme }) => theme.palette.color[2]};
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .explanation {
    margin-bottom: 1.5rem;
  }

  .cta-button {
    margin-bottom: 1.5rem;
  }

  .questions-container {
    /* text-align: center; */
    p {
      margin-bottom: 1.5rem;
    }
  }

  .bold {
    font-weight: 900;
  }
`;
