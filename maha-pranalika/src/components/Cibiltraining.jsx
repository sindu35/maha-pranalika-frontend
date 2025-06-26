import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cibiltraining.css";

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

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access this service. Redirecting to login page.");
      window.location.href = "/login";
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/cibil/register", cibilData);
      const data = response.data;
      console.log("Registration response:", data);
      
      

      const options = {
        key: data.key, // Replace with your Razorpay key ID
        amount: 499900,
        currency: "INR",
        name: "CIBIL Training",
        description: "Training Fee Payment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verify = await axios.post(
              "http://localhost:5000/api/cibil/verify-payment",
              {
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            );

            if (verify.data.success) {
              alert(" Payment successful! You are registered for CIBIL training.");

            } else {
              alert(" Payment verification failed. Please contact support.");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            alert("Server error during payment verification. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal closed by user");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: cibilData.fullName,
          email: cibilData.email,
          contact: cibilData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });

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
            type={
              field === "email" ? "email" : field === "phone" ? "tel" : "text"
            }
            value={cibilData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={(e) => validateField(field, e.target.value)}
            disabled={isSubmitting}
          />
          <span className="error-space">{errors[field]}</span>
        </label>
      ))}

      <label>
        Remarks:
        <textarea
          value={cibilData.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          onBlur={(e) => validateField("remarks", e.target.value)}
          disabled={isSubmitting}
        />
        <span className="error-space">{errors.remarks}</span>
      </label>

      <button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        style={{ 
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? "Processing..." : "Pay ₹4999 & Register Now"}
      </button>
    </div>
  );
}