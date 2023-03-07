import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';

function MessageChannel12(props) {
  // useEffect(() => {
  //   getAllNotification();
  // }, []);
  // useEffect(() => {
  //   console.log(props);
  // }, []);
  Echo.private(`App.User.${props.user.id}`).notification(notification => {
    // console.log(notification);
    props.loadNotification(notification);
  });

  return <div>Message</div>;
}

export default connect(
  state => ({
    user: store.select.Auth.user(state),
  }),
  ({ Test }) => ({
    loadNotification: Test.loadNotification,
  })
)(MessageChannel12);
