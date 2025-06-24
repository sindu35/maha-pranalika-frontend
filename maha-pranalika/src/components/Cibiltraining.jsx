import React,{useEffect} from "react";
import "../styles/Cibiltraining.css";

export default function Cibiltraining() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access this service. Redirecting to login page.");
      window.location.href = "/login";
    }
  }, []);

  const [cibilData, setCibilData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    preferedTrainingMode: "",
    city: "",
    experience: "",
    remarks: "",
  });

  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const validateField = (field, value) => {
    let message = "";

    if (!value.trim()) {
      message = "This field is required";
    } else {
      if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
        message = "Invalid email format";
      }
      if (field === "phone" && !/^\d{10}$/.test(value)) {
        message = "Phone number must be 10 digits";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  const handleChange = (field, value) => {
    setCibilData((prev) => ({ ...prev, [field]: value }));
    if (submitted) validateField(field, value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let allValid = true;

    Object.entries(cibilData).forEach(([field, value]) => {
      const valid = validateField(field, value);
      if (!valid) allValid = false;
    });

    if (allValid) {
      alert("Form submitted successfully");
      console.log(cibilData);
    } else {
      alert("Please correct the errors");
    }
  };

  return (
    <div className="cibil-container">
      <h2>CIBIL Training Registration</h2>

      <label>
        Full Name:
        <input
          type="text"
          value={cibilData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={(e) => validateField("fullName", e.target.value)}
        />
        <span className="error-space">{errors.fullName}</span>
      </label>

      <label>
        Email:
        <input
          type="email"
          value={cibilData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={(e) => validateField("email", e.target.value)}
        />
        <span className="error-space">{errors.email}</span>
      </label>

      <label>
        Phone:
        <input
          type="tel"
          value={cibilData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={(e) => validateField("phone", e.target.value)}
        />
        <span className="error-space">{errors.phone}</span>
      </label>

      <label>
        Education:
        <input
          type="text"
          value={cibilData.education}
          onChange={(e) => handleChange("education", e.target.value)}
          onBlur={(e) => validateField("education", e.target.value)}
        />
        <span className="error-space">{errors.education}</span>
      </label>

      <label>
        Preferred Training Mode:
        <input
          type="text"
          value={cibilData.preferedTrainingMode}
          onChange={(e) => handleChange("preferedTrainingMode", e.target.value)}
          onBlur={(e) => validateField("preferedTrainingMode", e.target.value)}
        />
        <span className="error-space">{errors.preferedTrainingMode}</span>
      </label>

      <label>
        City:
        <input
          type="text"
          value={cibilData.city}
          onChange={(e) => handleChange("city", e.target.value)}
          onBlur={(e) => validateField("city", e.target.value)}
        />
        <span className="error-space">{errors.city}</span>
      </label>

      <label>
        Experience:
        <input
          type="text"
          value={cibilData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          onBlur={(e) => validateField("experience", e.target.value)}
        />
        <span className="error-space">{errors.experience}</span>
      </label>

      <label>
        Remarks:
        <textarea
          value={cibilData.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          onBlur={(e) => validateField("remarks", e.target.value)}
        />
        <span className="error-space">{errors.remarks}</span>
      </label>

      <button onClick={handleSubmit}>Pay 4999 & Register Now</button>
    </div>
  );
}
