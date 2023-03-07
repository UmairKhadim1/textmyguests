import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import store from '../../redux/store';

type Props = {
  impersonate(userId: string): void,
  loadingImpersonate: boolean,
  isImpersonating: boolean,
};

const Impersonate = (props: Props) => {
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    props.impersonate({ userId: id, cb: () => history.push('/dashboard') });
  }, []);

  return <div>Impersonating...</div>;
};

export default connect(
  state => ({
    impersonating: store.select.Auth.isImpersonating(state),
    loadingImpersonate: state.loading.effects.Auth.impersonate,
  }),
  ({ Auth: { impersonate } }) => ({
    impersonate,
  })
)(Impersonate);
