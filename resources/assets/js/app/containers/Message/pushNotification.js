import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import axios from 'axios';
const pushNotification = props => {
  const usersData = async () => {
    const users = await axios.get('https://jsonplaceholder.typicode.com/users');
    // console.log(users.data);
  };
  useEffect(() => {
    // usersData();
  }, []);

  useEffect(() => {
    props.loadNotifications();
  }, []);
  // useEffect(
  //   () => {
  //     console.log(props.notifications);
  //   },
  //   [props.notifications]
  // );

  //   useEffect(
  //     () => {
  //       console.log(props.notifications);
  //     },
  //     [props.notifications]
  //   );
  return <div>pushNotification</div>;
};

export default connect(
  state => ({
    notifications: store.select.Test.allNotifications(state),
  }),
  ({ Test: { loadNotifications } }) => ({
    loadNotifications,
  })
)(pushNotification);
