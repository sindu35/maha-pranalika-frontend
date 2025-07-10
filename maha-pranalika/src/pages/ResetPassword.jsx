import React, { useEffect, useState } from "react";
import "../styles/reset.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ correct

export const ResetPassword = () => {
  const location = useLocation(); // ✅ MOVE HOOK TO TOP LEVEL

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Set token here
        },
      })
      .then((res) => {
        console.log(res);
        setIsTokenVerified(true);
      })
      .catch((err) => {
        console.log(err.response);
        window.alert(
          err.response?.data?.message || "Token verification failed"
        );
      });
  }, [location.search]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = jwtDecode(token);
    axios
      .post("http://localhost:5000/api/auth/resetpassword", {
        email,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      })
      .then((res) => {
        window.alert(res.data.msg);
        console.log(res.data);
      })
      .catch((err) => {
        window.alert(err.response.message);
        console.log(err.response);
      });
    if (password !== confirmPassword) {
      setError("Passwords do not match!");

      return;
    }

    // You can call API to reset password here
    alert("Password reset successful!");
  };

  return (
    <div className="reset-container">
      {isTokenVerified ? (
        <>
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit} className="reset-form">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
            <button type="submit">Reset Password</button>
          </form>
        </>
      ) : (
        <h3>Verifying Token... Please wait</h3>
      )}
    </div>
  );
};

export default ResetPassword;
