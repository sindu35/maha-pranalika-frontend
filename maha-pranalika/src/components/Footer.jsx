import React from 'react'
import './Footer.css';
import { useLanguage } from './LanguageContext';
export default function Footer() {
  const { lang } = useLanguage();
  return (
    <footer className="footer">
    <div className="footer-address">
    {lang === 'telugu' ? (
  
    <p>ఫ్లాట్ నెం. 101, ఎంఐజి 416, రోడ్ నెం. 4, కుకట్‌పల్లి హౌసింగ్ బోర్డు కాలనీ,<br />
    కుకట్‌పల్లి, హైదరాబాద్, తెలంగాణ 500072</p>
    ) : (
  
    <p>Flat No. 101, MIG 416, Road No. 4, Kukatpally Housing Board Colony,<br />
    Kukatpally, Hyderabad, Telangana 500072</p>
    )}
    </div>

    <div className="footer-map">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3215421290466!2d78.39177231487649!3d17.442433888049112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93d24a3d295f%3A0xc5ad3f19f63a3a8b!2sKukatpally%2C%20Hyderabad%2C%20Telangana%20500072!5e0!3m2!1sen!2sin!4v1710000000000"
        width="100%"
        height="200"
      ></iframe>
    </div>

    <div className="footer-contact">
    {lang === 'telugu' ? (
        <>
          <p>సంప్రదించండి: +91 789-388-1269</p>
          <p>ఈమెయిల్: info@mahapranalika.com</p>
        </>
      ) : (
        <>
          <p>Contact: +91 789-388-1269</p>
          <p>Email: info@mahapranalika.com</p>
        </>
      )}
    </div>
  </footer>
  )
}
