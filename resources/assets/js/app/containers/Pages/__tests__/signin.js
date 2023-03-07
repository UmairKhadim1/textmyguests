import React from 'react';
import { LoginForm } from '../signin';
import { shallow } from 'enzyme';
jest.mock('../../../redux/auth/reducer');

describe('Login Form tests', () => {
  it('should render without crash', () => {
    const wrapper = shallow(<LoginForm />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
