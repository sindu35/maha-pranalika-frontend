import React, { useState } from 'react';
import '../styles/firmform.css';

export default function Firmregistration() {
  const [formData, setFormData] = useState({
    basic_details: {
      fullName: '',
      fatherSpouseName: '',
      dob: '',
      email: '',
      mobile: '',
      altContact: '',
      address: ''
    },
    firm_details: {
      firmName: '',
      registrationType: '',
      businessNature: '',
      officeAddress: ''
    },
    partner_details: {
      director2Name: '',
      director2Email: '',
      pan: '',
      aadhaar: '',
      addressProof: ''
    },
    documents: {
      panCard: null,
      aadhaarCard: null,
      photos: null,
      addressProofDoc: null,
      dsc: null,
      noc: null
    },
    declaration: {
      declared: false
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.basic_details.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.basic_details.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.basic_details.mobile.match(/^\d{10}$/)) newErrors.mobile = 'Enter 10-digit number';
    if (!formData.declaration.declared) newErrors.declared = 'You must declare the information is true';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
      alert('Form submitted!');
    }
  };

  return (
    <div className="firm-registration">
      <h2>Firm Registration</h2>
      <form onSubmit={handleSubmit}>
        <section>
          <h3>Basic Details</h3>
          <label>Full Name of Applicant / Director 1:
            <input type="text" value={formData.basic_details.fullName} onChange={e => handleChange('basic_details', 'fullName', e.target.value)} />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </label>
          <label>Father/Spouse Name:
            <input type="text" value={formData.basic_details.fatherSpouseName} onChange={e => handleChange('basic_details', 'fatherSpouseName', e.target.value)} />
          </label>
          <label>Date of Birth:
            <input type="date" value={formData.basic_details.dob} onChange={e => handleChange('basic_details', 'dob', e.target.value)} />
          </label>
          <label>Email:
            <input type="email" value={formData.basic_details.email} onChange={e => handleChange('basic_details', 'email', e.target.value)} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label>Mobile Number:
            <input type="tel" value={formData.basic_details.mobile} onChange={e => handleChange('basic_details', 'mobile', e.target.value)} />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </label>
          <label>Alternate Contact Number:
            <input type="tel" value={formData.basic_details.altContact} onChange={e => handleChange('basic_details', 'altContact', e.target.value)} />
          </label>
          <label>Residential Address:
            <textarea value={formData.basic_details.address} onChange={e => handleChange('basic_details', 'address', e.target.value)} />
          </label>
        </section>

        <section>
          <h3>Firm Details</h3>
          <label>Proposed Name of the Firm / Company:
            <input type="text" value={formData.firm_details.firmName} onChange={e => handleChange('firm_details', 'firmName', e.target.value)} />
          </label>
          <label>Type of Registration Required:
            <select value={formData.firm_details.registrationType} onChange={e => handleChange('firm_details', 'registrationType', e.target.value)}>
              <option value="">Select Registration Type</option>
              <option value="proprietorship">Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llp">LLP</option>
              <option value="private_limited">Private Limited</option>
              <option value="public_limited">Public Limited</option>
              <option value="cooperative">Cooperative</option>
            </select>
          </label>
          <label>Main Nature of Business:
            <input type="text" value={formData.firm_details.businessNature} onChange={e => handleChange('firm_details', 'businessNature', e.target.value)} />
          </label>
          <label>Office/Business Address:
            <textarea value={formData.firm_details.officeAddress} onChange={e => handleChange('firm_details', 'officeAddress', e.target.value)} />
          </label>
        </section>

        <section>
          <h3>Partner/Director Details</h3>
          <label>Full Name of Director 2:
            <input type="text" value={formData.partner_details.director2Name} onChange={e => handleChange('partner_details', 'director2Name', e.target.value)} />
          </label>
          <label>Director 2 Email:
            <input type="email" value={formData.partner_details.director2Email} onChange={e => handleChange('partner_details', 'director2Email', e.target.value)} />
          </label>
          <label>PAN:
            <input type="text" value={formData.partner_details.pan} onChange={e => handleChange('partner_details', 'pan', e.target.value)} />
          </label>
          <label>Aadhaar Number:
            <input type="text" value={formData.partner_details.aadhaar} onChange={e => handleChange('partner_details', 'aadhaar', e.target.value)} />
          </label>
          <label>Address Proof:
            <input type="text" value={formData.partner_details.addressProof} onChange={e => handleChange('partner_details', 'addressProof', e.target.value)} />
          </label>
        </section>

        <section>
          <h3>Documents Upload</h3>
          <label>PAN Card of all partners/directors: <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('panCard', e.target.files[0])} /></label>
          <label>Aadhaar Card all partners/directors: <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('aadhaarCard', e.target.files[0])} /></label>
          <label>Passport size photos:  <input type="file" accept=".jpg,.jpeg,.png" onChange={e => handleFileChange('photos', e.target.files[0])} /></label>
          <label>Electricity bill / rent agreement for address proof:  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('addressProofDoc', e.target.files[0])} /></label>
          <label>Digital Signature Certificate:  <input type="file" accept=".pdf" onChange={e => handleFileChange('dsc', e.target.files[0])} /></label>
          <label>NOC from property owner: <input type="file" accept=".pdf" onChange={e => handleFileChange('noc', e.target.files[0])} /></label>
        </section>

        <section>
          <h3>Declaration</h3>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.declaration.declared}
              onChange={e => handleChange('declaration', 'declared', e.target.checked)}
            />
            I declare that the information provided is true and correct.
          </label>
          {errors.declared && <span className="error">{errors.declared}</span>}
        </section>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
