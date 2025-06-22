import React from 'react';
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="nav">
      <div>Home</div>
      <div>Services</div>
      <div>Privacy Policy</div>
      <div>FAQ</div>
      <div>Terms & conditions</div>
      <div onClick={() => navigate('/signup')}>Sign Up</div>
    </div>
  );
}
