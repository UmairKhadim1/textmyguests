import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

function OptList(props) {
  const [guests, setGuests] = useState({});
  useEffect(
    () => {
      if (props.guests) {
        let gst = props.guests.filter(gt => {
          return gt.isOptOut;
        });
        // console.log(gst);
        setGuests(gst);
      }
    },
    [props.guests]
  );

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
    },
  ];
  return 'No Data Found';
  // guests ? (
  //   <Table dataSource={guests} columns={columns} />
  // ) : (
  // );
}

export default OptList;
