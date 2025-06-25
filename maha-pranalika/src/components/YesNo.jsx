import React from 'react';
import '../styles/yesno.css';

const YesNo = ({handleChange}) => {
  return (
    <div className="yes-no-group">
    <label>
      <input type="radio" name="answer" value="yes" onChange={handleChange} />
      Yes
    </label>
    <label>
      <input type="radio" name="answer" value="no" onChange={handleChange} />
      No
    </label>
  </div>
  
  );
};

export default YesNo;
