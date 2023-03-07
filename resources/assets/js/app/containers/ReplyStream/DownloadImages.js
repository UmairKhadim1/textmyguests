import React, { useEffect, useState } from 'react';
import { Download, Button, Icon } from 'antd';
import axios from 'axios';
import { notification } from 'antd';
import { isEventActivated } from '../../helpers/functions';
import './Download.css';
function DownloadImages(props) {
  const [loadings, setLoadings] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const downloadHandler = async () => {
    setLoadings(true);
    const token = localStorage.getItem('token');
    let config = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-TOKEN': window.csrfToken,
      },
    };
    let response = await fetch(
      `${window.appUrl}/api/event/${props.event.id}/downloadImages`,
      config
    );
    let data = await response.blob();
    setLoadings(false);
    if (response.status == 200) {
      // console.log('response', response);
      // console.log('data', data);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        Math.random()
          .toString(36)
          .substr(2, 5) + '.zip'
      );

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
      // console.log('url is ', url);
      // console.log('link is', link);

      //now call api to delete above zip file from server...
      // console.log(typeof(response.header.entries()));
      for (var header of response.headers.entries()) {
        if (header[0] === 'file_name') {
          fetch(`${window.appUrl}/api/event/${header[1]}/deleteFile`, config)
            .then(response => {
              //do nothing
              // console.log(response)
            })
            .catch(error => {
              //do nothing
              // console.log('error',error)
            });
        }
      }
    } else if (response.status == 404) {
      notification.error({
        message: 'You do not have any image to download',
      });
    } else {
      notification.error({
        message: 'An error occure while downloading your images',
      });
    }
  };

  const emailHandler = async () => {
    setEmailLoading(true);
    const token = localStorage.getItem('token');
    let config = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-TOKEN': window.csrfToken,
      },
    };
    let response = await fetch(
      `${window.appUrl}/api/event/${props.event.id}/emailImages`,
      config
    );
    if (response.status == 200) {
      notification.success({
        message: 'Images`s attachment has sent to your email',
      });

      for (var header of response.headers.entries()) {
        if (header[0] === 'file_name') {
          fetch(`${window.appUrl}/api/event/${header[1]}/deleteFile`, config)
            .then(response => {
              //do nothing
              // console.log(response)
            })
            .catch(error => {
              //do nothing
              // console.log('error',error)
            });
        }
      }
    } else if (response.status === 404) {
      notification.error({
        message: 'You do not have any image to download',
      });
    } else {
      notification.error({
        message: 'An error occure while downloading your images',
      });
    }
    setEmailLoading(false);
  };
  useEffect(() => {
    var isPhone = {
      Android: function() {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: function() {
        return (
          isPhone.Android() ||
          isPhone.iOS() ||
          isPhone.BlackBerry() ||
          isPhone.Opera() ||
          isPhone.Windows()
        );
      },
    };
    if (isPhone.any()) {
      setIsMobile(true);
    }
  }, []);
  return (
    <div className="d-flex">
      <Button
        type="primary"
        disabled={!isEventActivated(props.event) || isMobile}
        loading={loadings}
        className="mr-1"
        onClick={downloadHandler}>
        <Icon type="download" />
        Download All Images
      </Button>

      <Button
        type="primary"
        disabled={!isEventActivated(props.event)}
        loading={emailLoading}
        onClick={emailHandler}>
        Email All Images
      </Button>
    </div>
  );
}

export default DownloadImages;
