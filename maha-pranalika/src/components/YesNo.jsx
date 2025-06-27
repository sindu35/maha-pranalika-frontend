import React from 'react';
import '../styles/yesno.css'; // optional: your custom styles

const YesNo = ({ name = "hasLoan", value = "", onChange }) => {
  return (
    <div className="yes-no-group">
      <label>
        <input
          type="radio"
          name={name}
          value="yes"
          checked={value === "yes"}
          onChange={onChange}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name={name}
          value="no"
          checked={value === "no"}
          onChange={onChange}
        />
        No
      </label>
    </div>
  );
};

export default YesNo;
