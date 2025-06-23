import React, { useState } from "react";
import "../styles/login.css";
import axios from "axios";
import { useLanguage } from "../components/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher"; // ✅ Import this

export default function Login() {
  const { translations } = useLanguage();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...form, [id]: value };
    setForm(updatedForm);
    validateField(id, value);
  };

  const validateField = (field, value) => {
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
          default:
            break;
        }
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (!hasErrors) {
      axios
        .post("http://localhost:5000/api/auth/login", form)
        .then((response) => {
          console.log("Login successful:", response.data);
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            window.location.href = "/";
          } else {
            console.error("Login failed:", response.data.message);
          }
        })
        .catch((error) => {
          console.error(
            "Login error:",
            error.response ? error.response.data : error.message
          );
          setErrors({
            ...errors,
            server:
              translations?.loginFailed || "Login failed. Please check your credentials.",
          });
        });
    }
  };

  return (
    <div className="signup-container">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <LanguageSwitcher /> {/* ✅ Add the switcher here */}
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{translations?.email || "Your Email"}</label>
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

        <button type="submit">{translations?.login || "LOGIN"}</button>

        <p
          className="login-text"
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => (window.location.href = "/signup")}
        >
          {translations?.dontHaveAccount || "Don't have an account?"}
        </p>

        {errors.server && <p className="error">{errors.server}</p>}
      </form>
    </div>
  );
}
