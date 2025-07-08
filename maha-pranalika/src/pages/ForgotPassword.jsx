import React, { useState } from 'react';
import '../styles/forgotpassword.css'
import axios from 'axios';
function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send email to backend here
    if(!email){
        window.alert("Email not present");
        return;
    }
    axios.post("http://localhost:5000/api/auth/forgotpassword",{email}).then(res=>{
console.log(res.data);
window.alert(`send reset link to ${email}`);
}).
 catch(err=>{
  
    window.alert(err.response.data.message);
 })
   
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-form">
        <div className="form-group">
          <label htmlFor="email">Enter your email address</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
