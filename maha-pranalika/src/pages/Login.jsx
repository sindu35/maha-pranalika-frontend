import React, { useState } from 'react';
import '../styles/login.css';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
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
      newErrors[field] = 'This field is required';
    } else {
      switch (field) {
        case 'email':
          newErrors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email';
          break;
        case 'password':
          newErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
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
        newErrors[field] = 'This field is required';
      } else {
        switch (field) {
          case 'email':
            newErrors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email';
            break;
          case 'password':
            newErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
            break;
        }
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (!hasErrors) {
      alert('Logged in successfully!');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" value={form.email} onChange={handleChange} />
          <span className="error">{errors.email || ' '}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={form.password} onChange={handleChange} />
          <span className="error">{errors.password || ' '}</span>
        </div>

        <button type="submit">LOGIN</button>
        <p
          className="login-text"
          style={{ cursor: 'pointer', textAlign: 'center' }}
          onClick={() => (window.location.href = '/signup')}
        >
          Don't have an account?
        </p>
      </form>
    </div>
  );
}
