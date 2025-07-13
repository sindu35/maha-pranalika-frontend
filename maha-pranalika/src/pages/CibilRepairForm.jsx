import React, { useState, useEffect } from "react";
import '../styles/cibilrepair.css';
import YesNo from "../components/YesNo";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function CibilRepairForm() {
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    } else {
      axios.get(`${apiUrl}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setUserId(response.data.user.id);
        } else {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      })
      .catch(() => {
        alert("Error fetching user data. Please try again.");
      });
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
    otherIssue: "",
    documents: {
      panCard: null,
      aadhaarCard: null,
      cibilReport: null,
      bankStatement: null,
      salary: null,
    },
    declaration: false,
    signatureDate: "",
  });

  const [errors, setErrors] = useState({});

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
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();

    [
      "fullName", "dob", "mobile", "email", "address", "pan", "aadhaar",
      "occupation", "income", "cibilScore", "hasLoan", "loanType",
      "bank", "emi", "signatureDate", "otherIssue"
    ].forEach(field => fd.append(field, formData[field]));

    fd.append("declaration", formData.declaration ? "true" : "false");

    formData.issues.forEach(issue => fd.append("issues[]", issue));

    Object.entries(formData.documents).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    fd.append("userId", userId);

    axios
      .post(`${apiUrl}/cibil-repair/register-cibil`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        alert("Cibil Repair registered successfully!");
        setFormData({
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
          otherIssue: "",
          documents: {
            panCard: null,
            aadhaarCard: null,
            cibilReport: null,
            bankStatement: null,
            salary: null,
          },
          declaration: false,
          signatureDate: "",
        });
      })
      .catch((error) => {
        console.error("Error registering firm:", error);
        alert("Error registering firm. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();

    if (!formData.fullName) newErrors.fullName = "Full name is required";

    if (!formData.dob) newErrors.dob = "Date of birth is required";
    else {
      const dob = new Date(formData.dob);
      if (isNaN(dob.getTime()) || dob > today) {
        newErrors.dob = "Please enter a valid date of birth";
      }
    }

    if (!formData.mobile) newErrors.mobile = "Valid mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must start with 6-9 and be 10 digits long";

    if (!formData.email.includes("@")) newErrors.email = "Valid email required";

    if (!formData.address) newErrors.address = "Residential address is required";
    else if (formData.address.length < 10)
      newErrors.address = "Residential address must be at least 10 characters";

    if (!formData.pan) newErrors.pan = "PAN is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan))
      newErrors.pan = "PAN must be in format ABCDE1234F";

    if (!formData.aadhaar) newErrors.aadhaar = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(formData.aadhaar))
      newErrors.aadhaar = "Aadhaar must be 12 digits";

    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.income) newErrors.income = "Income is required";
    if (!formData.cibilScore) newErrors.cibilScore = "CIBIL score is required";
    if (!formData.hasLoan) newErrors.hasLoan = "Loan status is required";
    if (!formData.loanType) newErrors.loanType = "Loan type is required";
    if (!formData.bank) newErrors.bank = "Bank is required";
    if (!formData.emi) newErrors.emi = "EMI is required";

    if (!formData.issues || formData.issues.length === 0)
      newErrors.issues = "Please select at least one issue";

    if (!formData.documents.panCard)
      newErrors.panDoc = "PAN card document is required";
    if (!formData.documents.aadhaarCard)
      newErrors.aadhaarDoc = "Aadhaar card document is required";
    if (!formData.documents.bankStatement)
      newErrors.bankDoc = "Bank statement is required";

    if (!formData.signatureDate) newErrors.signatureDate = "Date is required";
    else {
      const date = new Date(formData.signatureDate);
      if (isNaN(date.getTime()) || date > today) {
        newErrors.signatureDate = "Please enter a valid date";
      }
    }

    if (!formData.declaration)
      newErrors.declaration =
        "You must declare that the information provided is true and correct";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form className="cibil-form" onSubmit={handleSubmit}>
      <h2>CIBIL Score Repair Registration</h2>
      <h3>Client Details</h3>
      <hr className="grey-line" />

      <label>Full Name</label>
      <input name="fullName" value={formData.fullName} onChange={handleChange} />
      {errors.fullName && <span className="error">{errors.fullName}</span>}

      <label>Date of Birth</label>
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
      {errors.dob && <span className="error">{errors.dob}</span>}

      <label>Mobile Number</label>
      <input name="mobile" value={formData.mobile} onChange={handleChange} />
      {errors.mobile && <span className="error">{errors.mobile}</span>}

      <label>Email Address</label>
      <input name="email" value={formData.email} onChange={handleChange} />
      {errors.email && <span className="error">{errors.email}</span>}

      <label>Current Address</label>
      <textarea name="address" value={formData.address} onChange={handleChange} />
      {errors.address && <span className="error">{errors.address}</span>}

      <h3>Identification & Financial Info</h3>
      <hr className="grey-line" />

      <label>PAN Card Number</label>
      <input name="pan" value={formData.pan} onChange={handleChange} />
      {errors.pan && <span className="error">{errors.pan}</span>}

      <label>Aadhaar Number (Optional)</label>
      <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
      {errors.aadhaar && <span className="error">{errors.aadhaar}</span>}

      <label>Occupation</label>
      <select name="occupation" value={formData.occupation} onChange={handleChange}>
        <option value="">Select</option>
        <option>Employed</option>
        <option>Self-employed</option>
        <option>Student</option>
      </select>
      {errors.occupation && <span className="error">{errors.occupation}</span>}

      <label>Monthly Income (₹)</label>
      <input name="income" value={formData.income} onChange={handleChange} />
      {errors.income && <span className="error">{errors.income}</span>}

      <label>Current CIBIL Score (if known)</label>
      <input name="cibilScore" value={formData.cibilScore} onChange={handleChange} />
      {errors.cibilScore && <span className="error">{errors.cibilScore}</span>}

      <label>Do you have an existing loan or credit card?</label>
      <YesNo name="hasLoan" onChange={handleChange} value={formData.hasLoan} />
      {errors.hasLoan && <span className="error">{errors.hasLoan}</span>}

      <label>Loan Type</label>
      <input name="loanType" value={formData.loanType} onChange={handleChange} />
      {errors.loanType && <span className="error">{errors.loanType}</span>}

      <label>Bank/Institutions</label>
      <input name="bank" value={formData.bank} onChange={handleChange} />
      {errors.bank && <span className="error">{errors.bank}</span>}

      <label>EMI Amount (₹)</label>
      <input name="emi" value={formData.emi} onChange={handleChange} />
      {errors.emi && <span className="error">{errors.emi}</span>}

      <h3>Credit Issues Faced</h3>
      <hr className="grey-line" />
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
              checked={formData.issues.includes(issue)}
              onChange={handleChange}
            />
            {issue}
          </label>
        ))}
      </div>
      {errors.issues && <span className="error">{errors.issues}</span>}

      <label>Other (specify)</label>
      <input name="otherIssue" value={formData.otherIssue} onChange={handleChange} />

      <h3>Upload Required Documents</h3>
      <hr className="grey-line" />

      <label>PAN Card</label>
      <input type="file" name="panCard" onChange={handleChange} />
      {errors.panDoc && <span className="error">{errors.panDoc}</span>}

      <label>Aadhaar Card</label>
      <input type="file" name="aadhaarCard" onChange={handleChange} />
      {errors.aadhaarDoc && <span className="error">{errors.aadhaarDoc}</span>}

      <label>Latest CIBIL Report (if available)</label>
      <input type="file" name="cibilReport" onChange={handleChange} />

      <label>Bank Statement (last 3 months)</label>
      <input type="file" name="bankStatement" onChange={handleChange} />
      {errors.bankDoc && <span className="error">{errors.bankDoc}</span>}

      <label>Salary Slip (if applicable)</label>
      <input type="file" name="salary" onChange={handleChange} />

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <input
          type="checkbox"
          checked={formData.declaration}
          onChange={(e) =>
            setFormData({ ...formData, declaration: e.target.checked })
          }
          style={{ marginTop: "3px" }}
        />
        <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
          I hereby authorize <strong>MaahaPranalika Pvt Ltd</strong> to review my
          credit information and represent me in all necessary communications
          related to my credit score improvement. I confirm that the information
          provided is accurate to the best of my knowledge.
        </span>
      </div>
      {errors.declaration && (
        <span className="error">{errors.declaration}</span>
      )}

      <label>Date</label>
      <input type="date" name="signatureDate" value={formData.signatureDate} onChange={handleChange} />
      {errors.signatureDate && <span className="error">{errors.signatureDate}</span>}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
