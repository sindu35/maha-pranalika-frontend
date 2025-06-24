import React, { useState } from "react";
import "../styles/signup.css";
import axios from "axios";
import { useLanguage } from "../components/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher"; // ✅ Import switcher

export default function Signup() {
  const { translations } = useLanguage();

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
      newErrors[field] = translations?.required || "This field is required";
    } else {
      switch (field) {
        case "email":
          newErrors.email = /\S+@\S+\.\S+/.test(value)
            ? ""
            : translations?.invalidEmail || "Invalid email";
          break;
        case "password":
          newErrors.password =
            value.length >= 6
              ? ""
              : translations?.passwordLength || "Password must be at least 6 characters";
          break;
        case "confirmPassword":
          newErrors.confirmPassword =
            value === fullForm.password
              ? ""
              : translations?.confirmMismatch || "Passwords do not match";
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
        newErrors[field] = translations?.required || "This field is required";
      } else {
        switch (field) {
          case "email":
            newErrors.email = /\S+@\S+\.\S+/.test(value)
              ? ""
              : translations?.invalidEmail || "Invalid email";
            break;
          case "password":
            newErrors.password =
              value.length >= 6
                ? ""
                : translations?.passwordLength || "Password must be at least 6 characters";
            break;
          case "confirmPassword":
            newErrors.confirmPassword =
              value === form.password
                ? ""
                : translations?.confirmMismatch || "Passwords do not match";
            break;
        }
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (!hasErrors) {
      axios
        .post("http://localhost:5000/api/auth/signup", form)
        .then((response) => {
          console.log("Signup successful:", response.data);
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error(
            "Signup error:",
            error.response ? error.response.data : error.message
          );
          setErrors({
            ...errors,
            server:
              translations?.signupFailed || "Signup failed. Please try again later.",
          });
        });
    }
  };

  return (
    <div className="signup-container">

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{translations?.name || "Name"}</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={handleChange}
          />
          <span className="error">{errors.name || " "}</span>
        </div>

        <div className="form-group">
          <label htmlFor="email">{translations?.email || "Email"}</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
          />
          <span className="error">{errors.email || " "}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">{translations?.password || "Password"}</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
          />
          <span className="error">{errors.password || " "}</span>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            {translations?.confirmPassword || "Confirm Password"}
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span className="error">{errors.confirmPassword || " "}</span>
        </div>

        <button type="submit">{translations?.signup || "SIGN UP"}</button>

        <p
          className="login-text"
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => (window.location.href = "/login")}
        >
          {translations?.haveAccount || "Already have an account?"}
        </p>

        {errors.server && <p className="error">{errors.server}</p>}
      </form>
    </div>
  );
}
