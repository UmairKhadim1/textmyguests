import styled from 'styled-components';

const MessageListWrapper = styled.div`
  .action-tools {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: inline-box;

      & > * {
        margin-right: 4px;
      }
    }
  }

  .content-column {
    width: 400px;
    min-width: 300px;
  }

  .column-title {
    white-space: nowrap;
  }

  .actions-column {
    min-width: 105px;
  }

  .ant-table-row,
  .ant-table-thead {
    td,
    th {
      :not(.content-column) {
        text-align: center;
      }
    }
  }

  .ant-table-placeholder {
    margin-bottom: 2.5rem;
  }

  @media only screen and (max-width: 576px) {
    .ant-table-row {
      td,
      th {
        padding: 16px 8px;
      }
    }
  }
`;

export default MessageListWrapper;
