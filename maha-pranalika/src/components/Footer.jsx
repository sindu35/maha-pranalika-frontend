import React from "react";
import "./Footer.css";
import { useLanguage } from "./LanguageContext";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  if (location.pathname.includes("/admin")) {
    return null; // Don't render footer on admin pages
  }

  const { lang } = useLanguage();

  // ✅ Updated phone number
  const phoneNumber = "7893881269";
  const fullPhoneDisplay = "+91 7893 881 269";
  const whatsappLink = `https://wa.me/91${phoneNumber}`;
  const callLink = `tel:+917893881269`;

  return (
    <footer className="footer">
      {/* Address Section */}
      <div className="footer-address">
        {lang === "telugu" ? (
          <p>
            ఫ్లాట్ నెం. 101, ఎంఐజి 416, రోడ్ నెం. 4, కుకట్‌పల్లి హౌసింగ్ బోర్డు
            కాలనీ,
            <br />
            కుకట్‌పల్లి, హైదరాబాద్, తెలంగాణ 500072
          </p>
        ) : (
          <p>
            Flat No. 101, MIG 416, Road No. 4, Kukatpally Housing Board Colony,
            <br />
            Kukatpally, Hyderabad, Telangana 500072
          </p>
        )}
      </div>

      {/* Map Section */}
      <div className="footer-map">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3215421290466!2d78.39177231487649!3d17.442433888049112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93d24a3d295f%3A0xc5ad3f19f63a3a8b!2sKukatpally%2C%20Hyderabad%2C%20Telangana%20500072!5e0!3m2!1sen!2sin!4v1710000000000"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Contact Section */}
      <div className="footer-contact">
        {lang === "telugu" ? (
          <>
            <p>
              📞 <a href={callLink}>సంప్రదించండి: {fullPhoneDisplay}</a>
            </p>
            <p>
              💬{" "}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                వాట్సాప్‌లో చాట్ చేయండి
              </a>
            </p>
            <p>
              ఈమెయిల్:{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@swayamkrush.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                info@swayamkrush.com
              </a>
            </p>
          </>
        ) : (
          <>
            <p>
              📞 <a href={callLink}>Contact: {fullPhoneDisplay}</a>
            </p>
            <p>
              💬{" "}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@swayamkrush.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                info@swayamkrush.com
              </a>
            </p>
          </>
        )}
      </div>
    </footer>
  );
}
