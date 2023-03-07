import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';
import ThankYouImage from './thankYouIcon.svg';
import { Redirect } from 'react-router';
import './ThankYou.css';
// import ReactPixel from '../../components/pixel/FacebookPixel';
// import ReactGA from '../../components/pixel/ReactGA';
// import ReactPinterestTag from '../../components/pixel/PinterestPixel';
// ReactGA.plugin.require('ecommerce');

function ThankYou(props) {
  const location = useLocation();
  const [isRedirect, setIsRedirect] = useState(false);
  const [flag, setFlag] = useState(false);
  let history = useHistory();
  // const [state, setState] = useState(location.state);

  useEffect(
    () => {
      if (flag) {
        // console.log('flage value', flag);
      }
    },
    [flag]
  );

  useEffect(() => {
    let prevLocation = props.location;
    if (
      prevLocation &&
      prevLocation.state &&
      prevLocation.state === 'event-activated'
    ) {
      // console.log(props.location);
      //Pinterest Pixel
      //purchasing log on facebook
      //   ReactPinterestTag.track('checkout', {
      //     order_id: event.id,
      //     value: price,
      //     currency: 'USD',
      //     time: new Date().toISOString(),
      //   });
      //   //Google Analytics
      //   ReactGA.plugin.execute('ecommerce', 'addTransaction', {
      //     id: event.id.toString(),
      //     revenue: price.toString(),
      //   });
      //   ReactGA.plugin.execute('ecommerce', 'send');
      //   ReactGA.plugin.execute('ecommerce', 'clear');

      //   //FaceBook Pixel
      //   ReactPixel.track('Purchase', {
      //     value: price,
      //     currency: 'USD',
      //     date: new Date().toISOString(),
      //   });
      // props.location.
      setTimeout(() => {
        setIsRedirect(true);
        history.replace(location.state, '');
        // console.log('useeffect is running');
        // return <Redirect to="/dashboard/invoices" />;
      }, 5000);
    } else {
      // console.log('This part is running');
      history.goBack();
    }
  }, []);

  useEffect(
    () => {
      if (isRedirect) {
        // console.log('useeffect is running');
        setFlag(true);
        history.push('/dashboard/invoices');
      }
    },
    [isRedirect]
  );

  return location.state === 'event-activated' ? (
    <div className="ThankYouWrapper">
      <div className="imageWrapper">
        <img src={ThankYouImage} />
      </div>
      <div className="contentWrapper">
        <h2>You're All Set</h2>

        <p>
          Thanks for being awesome.
          <br /> We hope you enjoy your purchase!
        </p>
        {/* <h4>Jared,</h4> */}
        <p className="cofounder_content">Team, textmyguests</p>
      </div>
    </div>
  ) : (
    'Loading ...'
  );
}

export default ThankYou;
