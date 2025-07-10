import React, { useState, useEffect } from "react";
import "../styles/login.css";
import axios from "axios";
import { useLanguage } from "../components/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher"; // ✅ Import this
const apiUrl = import.meta.env.VITE_API_URL;
import { useToast } from "../utils/ToastContext";

import { useNavigate } from "react-router-dom";
export default function Login() {

  const { addToast } = useToast();

  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, []);

  const [errors, setErrors] = useState({});
  const goTo = (path) => {
    
    navigate(path);
  };
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
              : translations?.passwordLength ||
                "Password must be at least 6 characters";
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
                : translations?.passwordLength ||
                  "Password must be at least 6 characters";
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
        .post(`${apiUrl}` + "/auth/login", form)
        .then((response) => {
          console.log("Login successful:", response.data);
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            addToast("Login Successful","success");
            setTimeout(()=>{
              window.location.href = "/";
            },3000)
          } else {
            console.error("Login failed:", response.data.message);
            addToast("Login failed", "error"); // ✅ fixed here
          }
        })

        .catch((error) => {
          const message =
            error.response?.data?.message || "Login failed. Please try again.";

          if (error.response?.status === 404) {
            addToast("User not found", "error");
          } else if (error.response?.status === 401) {
            addToast("Invalid credentials", "error");
          } else {
            addToast("Login failed", "error");
          }
          setErrors({
            ...errors,
            server:
              translations?.loginFailed ||
              "Login failed. Please check your credentials.",
          });
        });
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{translations?.email || "Your Email"}</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email || " "}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {translations?.password || "Password"}
          </label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="error">{errors.password || " "}</span>
          )}
        </div>
        <div >
        <span  className="forgotpassword" onClick={() => goTo("/forgotpassword")}>
                  Forgot Password?
                </span>
        <button type="submit">{translations?.login || "LOGIN"}</button>
        </div>
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
