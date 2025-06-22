import React, { useState } from "react";
import "../styles/signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...form, [id]: value };
    setForm(updatedForm);
    validateField(id, value, updatedForm);
  };

  const validateField = (field, value, fullForm = form) => {
    let newErrors = { ...errors };

    if (!value.trim()) {
      newErrors[field] = "This field is required";
    } else {
      switch (field) {
        case "email":
          newErrors.email = /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email";
          break;
        case "name":
          newErrors.name = value.trim().length > 2 ? "" : "Name is too short";
          break;
        case "password":
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
          newErrors.password = passwordRegex.test(value)
            ? ""
            : "Password must be 8+ chars, include uppercase, lowercase, number & special char";
          break;
        case "confirmPassword":
          newErrors.confirmPassword =
            value === fullForm.password ? "" : "Passwords do not match";
          break;
        default:
          break;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const value = form[field];

      if (!value.trim()) {
        newErrors[field] = "This field is required";
      } else {
        switch (field) {
          case "email":
            newErrors.email = /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email";
            break;
          case "name":
            newErrors.name = value.trim().length > 2 ? "" : "Name is too short";
            break;
          case "password":
            const passwordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            newErrors.password = passwordRegex.test(value)
              ? ""
              : "Password must be 8+ chars, include uppercase, lowercase, number & special char";
            break;
          case "confirmPassword":
            newErrors.confirmPassword =
              value === form.password ? "" : "Passwords do not match";
            break;
        }
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (!hasErrors) {
      alert("Form submitted!");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
          />
          <span className="error">{errors.email || " "}</span>
        </div>

        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={handleChange}
          />
          <span className="error">{errors.name || " "}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
          />
          <span className="error">{errors.password || " "}</span>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span className="error">{errors.confirmPassword || " "}</span>
        </div>

        <button type="submit">SIGN UP</button>
        <p
          className="login-text"
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => (window.location.href = "/login")}
        >
          Already have an account?
        </p>
      </form>
    </div>
  );
}
