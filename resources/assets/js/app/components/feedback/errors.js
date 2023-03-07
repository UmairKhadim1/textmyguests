import React from 'react';
import PropTypes from 'prop-types';
import Alert from './alert';
import ErrorsWrapper from './errors.style';


const Errors = props => (
  <ErrorsWrapper className={props.errors.length === 0 ? 'empty' : '' }>
    {
      props.errors.map((error, id) => (
        <Alert key={id}
          onClose={() => props.onClear(id)}
          message={error.message}
          type="error"
          banner
          closable
        />
      ))
    }
  </ErrorsWrapper>
);

Errors.propTypes = {
  errors: PropTypes.array,
  onClear: PropTypes.func,
};

Errors.defaultProps = {
  errors: [],
  onClear: () => null,
};


export default Errors;
