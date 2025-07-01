import React, { useState, useEffect} from "react";
import '../styles/msme.css';
import YesNo from "../components/YesNo";
import axios from "axios";
export default function CibilRepairForm() {
    const [userId, setUserId] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherValue, setOtherValue] = useState('');

 
      useEffect(() => {
       
          
          const token = localStorage.getItem("token");
          console.log(token);
          if (!token) {
            window.location.href = "/";
          }
          else{
            axios 
            .get("http://localhost:5000/api/auth/verify", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .
            then((response) => {
              if (response.status === 200) {
                setUserId(response.data.user.id);
              } else {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "/";
              }
            })
            .catch((error) => {
              alert("Error fetching user data. Please try again.");
            });
          }
        }, []);
        const [formData, setFormData] = useState({
       "basic_info":{
        "client_name":"",
        "primary_product":"",
        "total_no_of_leads":"",
        "name_of_lead":"",
        "type_of_organisation":[],
        "lead_entity":"",
        "doe":"",
        "address":"",
        "city":"",
        "state":"",
        "district":"",
        "pincode":"",
       },
       "contact_info":{
        "contact_person":"",
        "designation":"",
        "phone":"",
        "email":"",
       },
       "cluster_details":{
        "no_of_participating":"",
        "average_years":"",
        "total_employment":"",
        "common_challenges":"",
        "key_interventions":"",
       },
       "documents":{
        "issues":[],
       },
       "declaration":{
        "signature":"",
        "declaration_date":"",
        "declared":"false",
       }

    });
   
    const handleCheckboxArrayChange = (e, section, field) => {
        const { value, checked } = e.target;
      
        setFormData((prev) => {
          const currentArray = prev[section][field] || [];
          const updatedArray = checked
            ? [...currentArray, value]
            : currentArray.filter((item) => item !== value);
      
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: updatedArray,
            },
          };
        });
      };
      const [errors, setErrors] = useState({});
      const validate = () => {
        const newErrors = {};
        const today = new Date();
      
        const b = formData.basic_info;
        const c = formData.contact_info;
        const cl = formData.cluster_details;
        const d = formData.documents;
        const de=formData.declaration;
        // Section A: Basic Info
        if (!b.client_name) newErrors.client_name = "Cluster name is required";
        if (!b.primary_product) newErrors.primary_product = "Primary product is required";
        if (!b.total_no_of_leads) newErrors.total_no_of_leads = "Total number of firms is required";
        if (!b.name_of_lead) newErrors.name_of_lead = "Name of lead organization is required";
        if (b.type_of_organisation.length === 0)
          newErrors.type_of_organisation = "Select at least one type of organization";
        if (!b.lead_entity) newErrors.lead_entity = "Registration number is required";
        if (!b.doe) {
          newErrors.doe = "Date of establishment is required";
        } else {
          const doe = new Date(b.doe);
          if (isNaN(doe.getTime()) || doe > today)
            newErrors.doe = "Enter a valid date of establishment";
        }
        if (!b.address) newErrors.address = "Cluster office address is required";
        if (!b.city) newErrors.city = "City is required";
        if (!b.district) newErrors.district = "District is required";
        if (!b.pincode || !/^\d{6}$/.test(b.pincode))
          newErrors.pincode = "Valid 6-digit pincode is required";
        if (!b.state) newErrors.state = "State is required";
      
        // Section B: Contact Info
        if (!c.contact_person) newErrors.contact_person = "Contact person name is required";
        if (!c.designation) newErrors.designation = "Designation is required";
        if (!c.phone || !/^[6-9]\d{9}$/.test(c.phone))
          newErrors.phone = "Valid 10-digit phone number required";
        if (!c.email || !c.email.includes("@"))
          newErrors.email = "Valid email is required";
      
        // Section C: Cluster Details
        if (!cl.no_of_participating) newErrors.no_of_participating = "Number of SMEs is required";
        if (!cl.average_years) newErrors.average_years = "Average years of operation is required";
        if (!cl.total_employment) newErrors.total_employment = "Total employment is required";
        if (!cl.common_challenges) newErrors.common_challenges = "Select at least one challenge";
        if (!cl.key_interventions) newErrors.key_interventions = "Key interventions are required";
      
        // Section D: Documents
        if (!d.issues || d.issues.length === 0)
          newErrors.issues = "Please select at least one document";
      
        // Declaration section (if applicable)
        if(!de.signature)
          newErrors.signature="Signature is required"
        if (!de.declaration_date) {
          newErrors.declaration_date = "Signature date is required";
        } else {
          const date = new Date(de.declaration_date);
          if (isNaN(date.getTime()) || date > today)
            newErrors.declaration_date = "Please enter a valid date";
        }
      
        if (!de.declared)
          newErrors.declared = "You must declare that the information provided is true";
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
      
      
      
      const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
      
        const fd = new FormData();
      
        // Append basic_info
        Object.entries(formData.basic_info).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(val => fd.append(`basic_info.${key}[]`, val));
          } else {
            fd.append(`basic_info.${key}`, value);
          }
        });
      
        // Append contact_info
        Object.entries(formData.contact_info).forEach(([key, value]) => {
          fd.append(`contact_info.${key}`, value);
        });
      
      
        Object.entries(formData.cluster_details).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(val => fd.append(`cluster_details.${key}[]`, val));
          } else {
            fd.append(`cluster_details.${key}`, value);
          }
        });
      
    
        formData.documents.issues.forEach(issue => {
          fd.append(`documents.issues[]`, issue);
        });
      
       
        if (userId) {
          fd.append("userId", userId);
        }
      
        axios.post("http://localhost:5000/api/msme/register-msme", fd)
          .then((response) => {
            alert("Form submitted successfully!");
        
          })
          .catch((error) => {
            alert("Submission failed. Please try again.");
            console.error(error);
          });
      };
      
        const handleChange = (e) => {
            const { name, value } = e.target;
            if (!name || !name.includes(".")) return;
          
            const [section, field] = name.split(".");
            
            setFormData((prev) => ({
              ...prev,
              [section]: {
                ...prev[section],
                [field]: value,
              },
            }));
          };
          
        return(
            <div className="msme-form">
             <h1 >MSME Cluster Registration Form <br/>
             (For use by associations/cluster groups)</h1>
             <form onSubmit={handleSubmit}>
             <section>
              <h2>Section A: Basic Information</h2>
          
              <label>1.Cluster Name:</label>
              <input type="text" name="basic_info.client_name" onChange={handleChange} />
              {errors.client_name && <p className="error-message">{errors.client_name}</p>}
          
              <label >2. Primary Product / Service of the Cluster: </label>
              <input type="text" name="basic_info.primary_product" onChange={handleChange} />
              {errors.primary_product && <p className="error-message">{errors.primary_product}</p>}
          
              <label >3. Total Number of Firms in the Cluster:</label>
              <input type="text" name="basic_info.total_no_of_leads" onChange={handleChange} />
              {errors.total_no_of_leads && <p className="error-message">{errors.total_no_of_leads}</p>}
          
              <label >4. Name of Lead Organization / SPV:</label>
              <input type="text" name="basic_info.name_of_lead" onChange={handleChange} />
              {errors.name_of_lead && <p className="error-message">{errors.name_of_lead}</p>}
          
              <label>5. Type of Organization:</label>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {['Registered Society', 'Section 8 Company', 'Trust', 'Producer Company'].map((type) => (
          <label key={type}>
          <input
            type="checkbox"
            value={type}
            checked={formData.basic_info.type_of_organisation.includes(type)}
            onChange={(e) => handleCheckboxArrayChange(e, 'basic_info', 'type_of_organisation')}
          />
          {type}
          </label>
          ))}
              {errors.type_of_organisation && <p className="error-message">{errors.type_of_organisation}</p>}
          
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Other"
                  checked={selectedOptions.includes('Other')}
                  onChange={handleCheckboxChange}
                />
                Other:
              </label>
          
              {selectedOptions.includes('Other') && (
                <input
                  type="text"
                  placeholder="Specify"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded-md"
                />
              )}
            </div>
          
            <label>6. Registration Number of SPV / Lead Entity:</label>
            <input type="text" name="basic_info.lead_entity" onChange={handleChange} />
            {errors.lead_entity && <p className="error-message">{errors.lead_entity}</p>}
          
            <label>7. Date of Establishment:</label>
            <input type="date" name="basic_info.doe" onChange={handleChange} />
            {errors.doe && <p className="error-message">{errors.doe}</p>}
          
            <label>8. Address of the Cluster Office:</label>
            <textarea name="basic_info.address" onChange={handleChange} />
            {errors.address && <p className="error-message">{errors.address}</p>}
          
            <div style={{display: "flex",gap:80}}>
              <div>
                <label  style={{width: "40px"}}>City:</label>
                <input type="text" name="basic_info.city" onChange={handleChange} />
                {errors.city && <p className="error-message">{errors.city}</p>}
              </div>
              <div>
                <label style={{width: "40px"}}>District:</label>
                <input type="text" name="basic_info.district" onChange={handleChange} />
                {errors.district && <p className="error-message">{errors.district}</p>}
              </div>
            </div>
            <div style={{display: "flex",gap:80}}>
              <div>
                <label style={{width: "40px"}}>State:</label>
                <input type="text" name="basic_info.state" onChange={handleChange} />
                {errors.state && <p className="error-message">{errors.state}</p>}
              </div>
              <div>
                <label  style={{width: "40px"}}>Pincode:</label>
                <input type="text" name="basic_info.pincode" onChange={handleChange} />
                {errors.pincode && <p className="error-message">{errors.pincode}</p>}
              </div>
            </div>
          </section>
          <section>
            <h2>Section B: Contact Information</h2>
            <label>Name of Cluster Contact Person:</label>
            <input type="text" name="contact_info.contact_person" onChange={handleChange} />
            {errors.contact_person && <p className="error-message">{errors.contact_person}</p>}
          
            <label>Designation:</label>
            <input type="text" name="contact_info.designation" onChange={handleChange} />
            {errors.designation && <p className="error-message">{errors.designation}</p>}
          
            <label>Phone Number:</label>
            <input type="text" name="contact_info.phone" onChange={handleChange} />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          
            <label>Email Address:</label>
            <input type="text" name="contact_info.email" onChange={handleChange} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </section>
          <section>
  <h2>Section C: Cluster Details</h2>
  <label>13. Number of Participating Units (SMEs):</label>
  <input type="text" name="cluster_details.no_of_participating" onChange={handleChange} />
  {errors.no_of_participating && <p className="error-message">{errors.no_of_participating}</p>}

  <label>14. Average Years of Operation of Cluster Firms:</label>
  <input type="text" name="cluster_details.average_years" onChange={handleChange} />
  {errors.average_years && <p className="error-message">{errors.average_years}</p>}

  <label>15. Total Employment in Cluster:</label>
  <input type="text" name="cluster_details.total_employment" onChange={handleChange} />
  {errors.total_employment && <p className="error-message">{errors.total_employment}</p>}

  <label>16. Common Challenges Faced by the Cluster:</label>
  <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
    {['Marketing', 'Finance', 'Technology', 'Infrastructure', 'Export Readiness'].map((challenge) => (
      <label key={challenge}>
        <input
          type="checkbox"
          value={challenge}
          checked={formData.cluster_details.common_challenges.includes(challenge)}
          onChange={(e) => handleCheckboxArrayChange(e, 'cluster_details', 'common_challenges')}
        />
        {challenge}
      </label>
    ))}

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        value="Other"
        checked={selectedOptions.includes('Other')}
        onChange={handleCheckboxChange}
      />
      Other:
    </label>

    {selectedOptions.includes('Other') && (
      <input
        type="text"
        placeholder="Specify"
        value={otherValue}
        onChange={(e) => setOtherValue(e.target.value)}
        className="border border-gray-300 px-2 py-1 rounded-md"
      />
    )}
  </div>
  {errors.common_challenges && <p className="error-message">{errors.common_challenges}</p>}

  <label>17. Key Interventions Required:</label>
  <textarea name="cluster_details.key_interventions" onChange={handleChange} />
  {errors.key_interventions && <p className="error-message">{errors.key_interventions}</p>}
</section>
<section>
  <h2>Section D: Documents to Attach</h2>
  <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
    {[ 'Copy of SPV Registration Certificate', 'PAN & GST of Lead Organization', 'Aadhaar of Authorized Signator', 'MSME Udyam Registrations of Cluster Firms', 'Consent Letters from Member Units', 'Cluster Map / Layout (if applicable)', 'Draft DPR (if available)',].map((doc) => (
      <label key={doc}>
        <input
          type="checkbox"
          value={doc}
          checked={formData.documents.issues.includes(doc)}
          onChange={(e) => handleCheckboxArrayChange(e, 'documents', 'issues')}
        />
        {doc}
      </label>
    ))}
  </div>
  {errors.issues && <p className="error-message">{errors.issues}</p>}
</section>
<section>
  <h2>Declaration</h2>
  <label>Signature:</label>
  <input type="text" name="basic_info.signature" onChange={handleChange} />
  {errors.signature && <p className="error-message">{errors.signature}</p>}

  <label>Date</label>
  <input type="date" name="basic_info.declaration_date" onChange={handleChange} />
  {errors.declaration_date && <p className="error-message">{errors.declaration_date}</p>}

  <label style={{ display: "flex", alignItems: "center" }}>
    <input
      type="checkbox"
      name="basic_info.declaration"
      onChange={handleChange}
      style={{ width: "20px", height: "20px", marginRight: "10px" }}
    />
    <span>
      I declare that the information provided above is true and correct to the best of my knowledge. 
      I understand that any false information may result in the rejection of my application.
    </span>
  </label>
  {errors.declared && <p className="error-message">{errors.declared}</p>}
</section>
<button type="submit" style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}>
          Submit Application
        </button>
</form>
</div>
);
    }