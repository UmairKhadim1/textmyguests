import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import ActionsWrapper from './actions.style';

type Props = {
  onEdit: () => null,
  onDelete: () => null,
  deleteConfirmMessage: string,
  is_testGroup: Boolean
};

const Actions = (props: Props) => (
  <ActionsWrapper>
    <li>
      <Button icon="edit" onClick={props.onEdit} />
    </li>
    <li>
      <Popconfirm
        title={props.deleteConfirmMessage}
        onConfirm={props.onDelete}
        okText="Yes"
        cancelText="No"
        placement="topRight">
        <Button icon="delete" disabled={props.is_testGroup} type="danger" />
      </Popconfirm>
    </li>
  </ActionsWrapper>
);

Actions.defaultProps = {
  deleteConfirmMessage: 'Are you sure you want to delete it?',
};

export default Actions;
