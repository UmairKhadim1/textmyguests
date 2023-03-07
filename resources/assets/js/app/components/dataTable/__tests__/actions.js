import React from 'react';
import { shallow } from 'enzyme';
import Actions from '../actions';

describe('Table Actions Tests', () => {
  it('should render without scratch', () => {
    const wrapper = shallow(<Actions />);
    expect(wrapper).toMatchSnapshot();
  });
});
