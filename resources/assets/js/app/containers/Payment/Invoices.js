// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { Layout, Table } from 'antd';
import styled from 'styled-components';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import _ from 'lodash';

const { Column } = Table;
const { Content } = Layout;

const StyledTable = styled(Table)`
  margin-bottom: 2rem;

  .column-fit-content {
    width: 1%;
    white-space: nowrap;
  }

  .column-date {
    padding-right: 2rem;
  }

  .column-bold {
    font-weight: 600;
  }

  .column-download {
    text-align: center;
  }
`;

type Props = {
  invoices: any[],
  loadInvoices: () => void,
  loading: boolean,
};

const Invoices: React.FC = (props: Props) => {
  useEffect(() => {
    props.loadInvoices();
  }, []);

  return (
    <LayoutWrapper>
      <PageHeader>
        <span className="title">Invoices</span>
      </PageHeader>
      <Content style={{ overflow: 'auto' }}>
        <StyledTable
          loading={{
            spinning: props.loading,
          }}
          rowKey={invoice => invoice.id}
          dataSource={props.invoices}
          pagination={false}
          scroll={{ x: 'auto' }}>
          <Column
            title={<span className="column-title">Date</span>}
            align="center"
            render={invoice => invoice.paid_at.format('YYYY-MM-DD')}
            key="date"
            className="column-fit-content column-date"
          />
          <Column
            title={<span className="column-title">Event</span>}
            render={invoice => invoice.shindig.name}
            key="event"
            className="column-bold"
          />
          <Column
            title={<span className="column-title">Description</span>}
            key="description"
            dataIndex="description"
          />
          <Column
            title={<span className="column-title">Total Amount</span>}
            render={invoice =>
              (invoice.total_price < 0 ? '- ' : '') +
              '$' +
              Math.abs(invoice.total_price).toFixed(2)
            }
            key="totalPrice"
            className="column-bold"
          />
          <Column
            title={<span className="column-title">Paid Amount</span>}
            render={invoice =>
              (invoice.paid_amount < 0 ? '- ' : '') +
              '$' +
              Math.abs(invoice.paid_amount).toFixed(2)
            }
            key="totalPrice"
            className="column-bold"
          />
          <Column
            title={<span className="column-title">Download</span>}
            key="actions"
            render={invoice => (
              <a href={`/invoices/${invoice.slug}`} target="_blank">
                <i
                  className="ion-ios-download-outline"
                  style={{ marginRight: '0.5rem' }}
                />
                Full invoice
              </a>
            )}
            align="center"
            className="column-fit-content"
          />
        </StyledTable>
      </Content>
    </LayoutWrapper>
  );
};

export default connect(
  state => ({
    invoices: store.select.Invoice.allInvoices(state),
    loading: state.loading.effects.Invoice.loadInvoices,
  }),
  ({ Invoice: { loadInvoices } }) => ({
    loadInvoices,
  })
)(Invoices);
