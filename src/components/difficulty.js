import React from 'react';

const options = [
  { label: 'Easy', value: 'easy' },
  { label: 'Hard', value: 'hard' },
];

const Dropdown = ({ label, value, options, onChange, info }) => {
  return (
    <div className='center'>
      <h2>
      {label}
      </h2>
      <div className='select'>
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <h4>
      {info}
      </h4>
    </div>
  );
};

const Difficulty = (props) => (
  <div class="select-container">
    <Dropdown
      label="Set Difficulty Level"
      options={options}
      // value={props.level}
      onChange={props.onChange}
      info={props.info}
    />
  </div>
)

export default Difficulty