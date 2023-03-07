import styled from 'styled-components';


const SelectStyle = ComponentName => styled(ComponentName)`
  &.root {
    padding: 10px;

    .ant-select {
      width: 100%;
    }
  }
`;

export default SelectStyle;
