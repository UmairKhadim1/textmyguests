import React from 'react';
import { notification } from 'antd';
import axios from './../../services/api/axios';
import { useState } from 'react';
import './Promo.css';
// import { isEventActivated } from '../../helpers/functions';
function Promo(props) {
  const [code, setCode] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (code.length === 0) {
      notification.error({
        message: 'Promo Code field can not be empty',
      });
    } else if (code.length > 8) {
      notification.error({
        message: 'Promo Code should only contains maximum 8 characters',
      });
    } else if (code.length < 4) {
      notification.error({
        message: 'Promo Code should only contains minimum 4 characters',
      });
    } else {
      const data = {
        promocode: code,
      };
      axios.post(`/event/${props.event.id}/promo`, data).then(res => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          var promodata = res.data.data;
          setCode('');
          notification.success({
            message: res.data.message,
          });

          // console.log('promocode checking');

          props.getPromodata(promodata.type, promodata.price, promodata.id);
        } else {
          setCode('');
          notification.error({
            message: res.data.message,
          });
          // console.log('could not found the promocode');
        }
      });
    }
  };
  return (
    <div>
      <h3>Got a Promo?</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            value={code}
            onChange={e => setCode(e.target.value)}
            min={6}
            max={6}
            placeholder="Enter Promo Code Here"
            disabled={props.checkActivation}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={props.checkActivation}>
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}

export default Promo;
