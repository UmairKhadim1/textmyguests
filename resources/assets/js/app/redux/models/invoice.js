import { notification } from 'antd';
import api from '../../services/api';

export const initialState = {};

export default {
  state: initialState,
  reducers: {
    onLoadInvoices(state, invoices = []) {
      return invoices.reduce((map, invoice) => {
        map[invoice.id] = invoice;
        return map;
      }, {});
    },
  },
  effects: {
    async loadInvoices() {
      try {
        const invoices = await api.getInvoices();
        this.onLoadInvoices(invoices);
      } catch (e) {
        notification.error({
          message: 'Error loading invoices',
        });
      }
    },
  },
  selectors: slice => ({
    allInvoices() {
      return slice(invoices => Object.values(invoices));
    },
  }),
};
