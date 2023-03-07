import React, {useEffect} from 'react';
import { Checkbox } from 'antd';
import './GroupControl.css';


const GroupControl = ({
  groups = [],
  selected = {},
  showAll = true,
  disableIfAll = false,
  is_testGroup = false,
  is_hide_testGroup = false,
  onChange,
  onClick,
}: {
  groups: Array<Object>,
  selected: Object,
  showAll: boolean,
  disableIfAll: boolean,
  is_testGroup:boolean,
  is_hide_testGroup: boolean,
  onChange: Function,
  onClick: Function,
}) => {
  const handleAllGuests = e => {
    const add = e.target.checked;
    let newSelected = {};
    if (add) {
      newSelected = { all: true };
    }
    onChange(newSelected);
    onClick(newSelected)//this will send the selected group
  };

  // useEffect(()=> {
  //   if(is_testGroup){//if the test group only is enabled then only test group will be checked
  //     groups.map(group => {
  //       if(group.is_testGroup) {
  //         const data = {}
  //         const id = group.id
  //         let gid = id.toString()
  //         data[gid] = true
  //         onChange(data)
  //       }
  //     })
  //   }
  //   else {
  //     onChange([])
  //   }
  // }, [is_testGroup])

  const handleGroupSelect = (id, e) => {
    const add = e.target.checked;
    // Copy the selected map
    
      const newSelected = { ...selected };
      // Clean state
      delete newSelected.all; // pollute the condition
      if (add) {
        // We save the selected state
        newSelected[id.toString()] = true;
      } else {
        // We just remove this one
        delete newSelected[id.toString()];
      }
      onChange(newSelected);
      onClick(newSelected) //this will send the selected group
  };

  const eventGroups = groups.filter(group => !group.is_all);
  const all = !!selected.all;
  return (
    <div>
      {showAll ? (
        <div key="all">
          <Checkbox checked={all} onChange={handleAllGuests} >
            All Guests
          </Checkbox>
        </div>
      ) : null}
      {eventGroups.map(group => (
        <div key={group.id} className={is_hide_testGroup && group.is_testGroup ? 'd-none': 'd-block'}>
          <Checkbox
            disabled= {disableIfAll && all }
            checked={ !!selected[group.id.toString()]}
            onChange={e => handleGroupSelect(group.id, e, group.name)}>
            {group.name}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};

export default GroupControl;
