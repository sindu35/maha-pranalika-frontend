import React, { useState, useEffect} from "react";
import '../styles/visa.css';
import YesNo from "../components/YesNo";

export default function VisaOverseas() {
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
  const documentItems = [
    'Copy of Passport',
    'Passport-size Photo',
    'Resume / CV',
    'Educational Certificates',
    'IELTS/TOEFL Scorecard',
    'Work Experience Letters',
    'Any previous visa documents',
  ];
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
      <h2>Overseas Consultation – Client Registration Form</h2>
     <h3>Section 1: Personal Information</h3>
     <hr class="grey-line"/>

      <label>Full Name</label>
      <input name="fullName" onChange={handleChange} />

      <label>Date of Birth</label>
      <input name="dob" type="date" onChange={handleChange} />
      <label>Gender</label>
      <div className="gender-group">
  <label>
    <input
      type="radio"
      name="gender"
      value="male"
      onChange={handleChange}
    />
    Male
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="female"
      onChange={handleChange}
    />
    Female
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="other"
      onChange={handleChange}
    />
    Other
  </label>
</div>
<label>Nationality</label>
<input name="nationality" onChange={handleChange} />
<label>Passport Number</label>
<input name="passport" onChange={handleChange} />
      <label>Passport Expiry Date</label>
      <input name="passport-expiration" type="date" onChange={handleChange} />
      <label>Phone Number</label>
      <input name="phone" onChange={handleChange} />

      <label>Email Address</label>
      <input name="email" onChange={handleChange} />

      <label>Resdential Address</label>
      <textarea name="address" onChange={handleChange} />

      <h3>Section 2: Purpose of Consultation</h3>
      <hr class="grey-line"/>
      <div className="visa-options-wrapper">
      <div className="visa-checkbox-group">
        <label className="visa-checkbox">
          <input type="checkbox" />
          <span>Student<br />Visa</span>
        </label>

        <label className="visa-checkbox">
          <input type="checkbox" />
          <span>Work<br />Visa</span>
        </label>

        <label className="visa-checkbox">
          <input type="checkbox" />
          <span>Business/Investor<br />Visa</span>
        </label>

        <label className="visa-checkbox">
          <input type="checkbox" />
          <span>Permanent<br />Residency<br />(PR)</span>
        </label>

        <label className="visa-checkbox">
          <input type="checkbox" />
          <span>Family/Dependent<br />Visa</span>
        </label>

        <label className="visa-checkbox other-option">
          <input type="checkbox" />
          <span>Other:</span>
          <input type="text" className="other-input" />
        </label>
      </div>
    </div>


      <label>Preferred Country/Countries:</label>
      <input name="preffered-country" onChange={handleChange} />

      <label>If referred, name of referrer:</label>
      <input name="name-refferer" onChange={handleChange} />
      <h3>Section 3: Education & Experience</h3>
      <hr class="grey-line"/>
      <div className="education-form-box">
      <div className="education-header">
        <div>Qualification</div>
        <div>Institution Name</div>
        <div>Year of Completion</div>
      </div>

      <div className="education-row">
        <input type="text" placeholder="" />
        <input type="text" placeholder="" />
        <input type="text" placeholder="" />
      </div>

      <div className="education-row">
        <input type="text" placeholder="" />
        <input type="text" placeholder="" />
        <input type="text" placeholder="" />
      </div>
    </div>
      <label>Current Occupation</label>
      <input name="current-occupation" onChange={handleChange} />
      <label>Total Work Experience (in years):</label>
      <input name="work-experience" onChange={handleChange} />
      <h3>Section 4:  Language Proficiency</h3>
      <hr class="grey-line"/>
      <div className="language-form-container">
      <div className="language-form-header">
        <div>Language</div>
        <div>Speak</div>
        <div>Read</div>
        <div>Write</div>
        <div>Exam Taken (IELTS/TOEFL/Others)</div>
      </div>

      <div className="language-form-row">
        <div>English</div>
        <input type="checkbox" />
        <input type="checkbox" />
        <input type="checkbox" />
        <input type="text" />
      </div>

      <div className="language-form-row">
        <input type="text" />
        <input type="checkbox" />
        <input type="checkbox" />
        <input type="checkbox" />
        <input type="text" />
      </div>
    </div>
    <h3>Section 5:  Additional Details</h3>
      <hr class="grey-line"/>
      <label>Have you previously applied for a visa?</label>
      <YesNo onChange={handleChange}/>

     <label>If yes, please provide details:</label>
      <input name="provide-details" onChange={handleChange} />

      <label>Any prior visa rejection?</label>
      <YesNo onChange={handleChange}/>

      <label>If yes, reasons:</label>
      <input name="reasons" onChange={handleChange} />

      <label>Any legal issues in the past?</label>
      <YesNo onChange={handleChange}/>
      <h3>Section 5:  Declaration</h3>
      <hr class="grey-line"/>
      <div className="document-checklist">
      {documentItems.map((label, index) => (
        <label key={index} className="doc-item">
          <input type="checkbox" />
          <span>{label}</span>
        </label>
      ))}
    </div>
    <h3>Declaration</h3>
    <hr class="grey-line"/>
    <div className="declaration">
      <p>
        
        I hereby authorize <strong>MaahaPranalika Pvt Ltd</strong> to review my credit information and represent me in all necessary communications related to my credit score improvement. I confirm that the information provided is accurate to the best of my knowledge.
      </p>
      <label>Signature:</label>
        <input
          type="text"
          name="signature"
          value={formData.signature}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
        />

      <label>Date</label>
      <input name="signatureDate" type="date" onChange={handleChange} />
      </div>
      <button type="submit">Submit Application</button>
    </form>
  );
}
