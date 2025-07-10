import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cibiltraining.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Cibiltraining() {
  const [cibilData, setCibilData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    preferedTrainingMode: "",
    city: "",
    experience: "",
    remarks: "",
  });
  const [userId, setUserId] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access this service. Redirecting to login page.");
      window.location.href = "/login";
    } else {
      axios
        .get(`${apiUrl}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setUserId(response.data.user.id);
          } else {
            alert("Session expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        })
        .catch(() => {
          alert("Error fetching user data. Please try again.");
        });
    }
  }, []);

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

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setSubmitted(true);
    setIsSubmitting(true);

    let allValid = true;
    Object.entries(cibilData).forEach(([field, value]) => {
      const valid = validateField(field, value);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      alert("Please correct the errors.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { ...cibilData, userId };
      const response = await axios.post(`${apiUrl}/cibil/register`, payload);
      console.log("Registration response:", response.data);
      alert("Successfully registered for CIBIL training.");
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        const errorMessage = error.response.data?.message || "Registration failed";
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("Registration failed. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cibil-container">
      <h2>CIBIL Training Registration</h2>
      {[
        ["Full Name", "fullName"],
        ["Email", "email"],
        ["Phone", "phone"],
        ["Education", "education"],
        ["Preferred Training Mode", "preferedTrainingMode"],
        ["City", "city"],
        ["Experience", "experience"],
      ].map(([label, field]) => (
        <label key={field}>
          {label}:
          <input
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            value={cibilData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            disabled={isSubmitting}
          />
          {errors[field] && <span className="error-space">{errors[field]}</span>}
        </label>
      ))}

      <label>
        Remarks:
        <textarea
          value={cibilData.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          disabled={isSubmitting}
        />
        {errors.remarks && <span className="error-space">{errors.remarks}</span>}
      </label>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Submitting..." : "Register Now"}
      </button>
    </div>
  );
}
