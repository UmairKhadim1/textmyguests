import React from 'react';
import { shallow } from 'enzyme';
import GroupControl from '../GroupControl';

describe('GroupControl Tests', () => {
  it('should render without crash', () => {
    const groups = [
      {
        id: 1,
        name: 'Group 1',
      },
    ];
    const wrapper = shallow(<GroupControl groups={groups} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render without the all guest checkbox', () => {
    const groups = [
      {
        id: 1,
        name: 'Group 1',
      },
    ];
    const wrapper = shallow(<GroupControl groups={groups} showAll={false} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should select only one group', () => {
    const groups = [
      {
        id: 1,
        name: 'Group 1',
      },
      {
        id: 2,
        name: 'Group 2',
      },
    ];
    const handler = jest.fn();
    const wrapper = shallow(
      <GroupControl groups={groups} onChange={handler} showAll={false} />
    );

  });
});
