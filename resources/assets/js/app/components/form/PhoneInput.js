import React from 'react';
import { Input } from 'antd';

const PhoneInput = ({
  onChange,
  value,
  ...props
}: {
  value: string,
  onChange: string => void,
}) => {
  const handleChange = event => {
    const value = event.target.value
      .trim()
      .replace(/\D/g, '')
      .substr(0, 10);
    onChange(value);
  };
  const formattedValue = value.replace(
    /(\d{3})(\d{1,3})?(\d{1,4})?/,
    (match, p1, p2, p3) => {
      let s = p1;
      if (p2 && p2.length) s = s + '-' + p2;
      if (p3 && p3.length) s = s + '-' + p3;
      return s;
    }
  );
  return <Input onChange={handleChange} value={formattedValue} {...props} />;
};

export default PhoneInput;
