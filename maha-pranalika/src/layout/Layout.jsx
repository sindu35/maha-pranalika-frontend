import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../components/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const Layout = ({ children }) => {
  const location = useLocation();
  const isRootPath =
    location.pathname === "/signup" || location.pathname === "/login";

  return (
    <LanguageProvider>
      <div
        style={{
          backgroundColor: "#2d2a8e",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 20px",
          fontFamily: "Arial, sans-serif",
          color: "#fff",
        }}
      >
        <div className="social-icons" style={{ display: "flex", gap: "15px" }}>
          <a
            href="https://www.facebook.com/share/19adosqB3t/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", fontSize: "18px" }}
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            href="https://www.instagram.com/project_swayamkrush/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", fontSize: "18px" }}
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://wa.me/7893881269"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", fontSize: "18px" }}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>

        <LanguageSwitcher />
      </div>

      <Navbar />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
};

export default Layout;
