import axios from './axios';
import Moment from 'moment';

const transformInvoice = (invoice: Object) => ({
  ...invoice,
  paid_at: Moment(invoice.paid_at),
});

const getInvoices = () =>
  axios
    .get(`/invoices/`)
    .then(res => Promise.resolve(res.data.data.map(transformInvoice)));

const getInvoiceForRefund = (eventId: string, amount: number) =>
  axios.post(`events/${eventId}/refund-get-invoice`, { amount }).then(res => {
    if (res.status === 200 && res.data.status === 'success') {
      if (res.data.data.invoice) {
        return Promise.resolve(transformInvoice(res.data.data.invoice));
      }
      return Promise.resolve(null);
    }

    return Promise.reject(
      new Error('We could not retrieve your refund information.')
    );
  });

export default {
  getInvoices,
  getInvoiceForRefund,
};
