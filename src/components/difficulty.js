import React from 'react';

const options = [
  { label: 'Easy', value: 'easy' },
  { label: 'Hard', value: 'hard' },
];

const Dropdown = ({ label, value, options, onChange }) => {
  return (
    <div>
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
    />
  </div>
)

export default Difficulty