import React, { useState, useEffect} from "react";
import '../styles/cibilrepair.css';
export default function CibilRepairForm() {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/";
        }
      }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    pan: "",
    aadhaar: "",
    occupation: "",
    income: "",
    cibilScore: "",
    hasLoan: "",
    loanType: "",
    bank: "",
    emi: "",
    issues: [],
    documents: {
      pan: null,
      aadhaar: null,
      cibil: null,
      bank: null,
      salary: null,
    },
    declaration: false,
    signatureDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        documents: { ...formData.documents, [name]: files[0] },
      });
    } else if (type === "checkbox" && name === "issues") {
      setFormData({
        ...formData,
        issues: checked
          ? [...formData.issues, value]
          : formData.issues.filter((v) => v !== value),
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("CIBIL Repair form submitted!");
  };

  return (
    <form className="cibil-form" onSubmit={handleSubmit}>
      <h2>CIBIL Score Repair Registration</h2>
     <h3>Client Details</h3>
     <hr class="grey-line"/>

      <label>Full Name</label>
      <input name="fullName" onChange={handleChange} />

      <label>Date of Birth</label>
      <input name="dob" type="date" onChange={handleChange} />

      <label>Mobile Number</label>
      <input name="mobile" onChange={handleChange} />

      <label>Email Address</label>
      <input name="email" onChange={handleChange} />

      <label>Current Address</label>
      <textarea name="address" onChange={handleChange} />

      <h3>Identification & Financial Info</h3>
      <hr class="grey-line"/>


      <label>PAN Card Number</label>
      <input name="pan" onChange={handleChange} />

      <label>Aadhaar Number (Optional)</label>
      <input name="aadhaar" onChange={handleChange} />

      <label>Occupation</label>
      <select name="occupation" onChange={handleChange}>
        <option value="">Select</option>
        <option>Employed</option>
        <option>Self-employed</option>
        <option>Student</option>
      </select>

      <label>Monthly Income (₹)</label>
      <input name="income" onChange={handleChange} />

      <label>Current CIBIL Score (if known)</label>
      <input name="cibilScore" onChange={handleChange} />

      <label>Do you have existing loan or credit card?</label>
      <select name="hasLoan" onChange={handleChange}>
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <label>Loan Type</label>
      <input name="loanType" onChange={handleChange} />

      <label>Bank/Institutions</label>
      <input name="bank" onChange={handleChange} />

      <label>EMI Amount (₹)</label>
      <input name="emi" onChange={handleChange} />

      <h3>Credit Issues Faced</h3>
      <hr class="grey-line"/>

      <div className="flex flex-wrap items-center gap-4">
  {[
    "Loan Default / Delayed Payments",
    "Credit Card Overdues",
    "Written off Accounts",
    "High Credit Utilization",
    "Loan Rejections",
    "Unknown CIBIL Drop",
    "Disputed Accounts",
  ].map((issue) => (
    <label key={issue} className="flex items-center gap-2">
      <input
        type="checkbox"
        name="issues"
        value={issue}
        onChange={handleChange}
      />
      {issue}
    </label>
  ))}
</div>


      <label>Other (specify)</label>
      <input name="otherIssue" onChange={handleChange} />

      <h3>Upload Required Documents</h3>
      <hr class="grey-line"/>

      <label>PAN Card</label>
      <input type="file" name="pan" onChange={handleChange} />

      <label>Aadhaar Card</label>
      <input type="file" name="aadhaar" onChange={handleChange} />

      <label>Latest CIBIL Report (if available)</label>
      <input type="file" name="cibil" onChange={handleChange} />

      <label>Bank Statement (last 3 months)</label>
      <input type="file" name="bank" onChange={handleChange} />

      <label>Salary Slip (if applicable)</label>
      <input type="file" name="salary" onChange={handleChange} />

      <label >
        
        I hereby authorize <strong>MaahaPranalika Pvt Ltd</strong> to review my credit information and represent me in all necessary communications related to my credit score improvement. I confirm that the information provided is accurate to the best of my knowledge.
      </label>

      <label>Date</label>
      <input name="signatureDate" type="date" onChange={handleChange} />

      <button type="submit">Submit Application</button>
    </form>
  );
}
