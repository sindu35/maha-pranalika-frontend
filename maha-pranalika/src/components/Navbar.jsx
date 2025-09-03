import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useLanguage } from "./LanguageContext";
import swayamkrush from "../assets/swayamkrush.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import { useToast } from "../utils/ToastContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { lang: currentLang, translations } = useLanguage();
  const navLabels = translations[`nav-${currentLang}`];
  const [isLogin, setIsLogin] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    if (!token) {
      setIsLogin(false);
      setIsAdmin(false);
    } else {
      axios
        .get(`${apiUrl}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsLogin(true);
            setIsAdmin(response.data.user.role === "admin");
          } else {
            localStorage.removeItem("token");
            setIsLogin(false);
            setIsAdmin(false);
            alert("Session expired. Please login again.");
            window.location.href = "/";
          }
        })
        .catch((error) => {
          localStorage.removeItem("token");
          setIsLogin(false);
          setIsAdmin(false);
          alert("Invalid session. Please login again.");
          window.location.href = "/";
        });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goTo = (path) => {
    setShowMobileMenu(false);
    setShowMobileDropdown(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    addToast("Session Logging out", "success");
    setTimeout(() => {
      setIsLogin(false);
      setIsAdmin(false);
      goTo("/");
    }, 3000);
  };

  if (isMobile) {
    // MOBILE NAVBAR
    return (
      <div className="mobile-nav">
        <div className="nav-header-container">
          <div className="logo-container" onClick={() => goTo("/")}>
            <img src={logo} alt="logo" />
            {/* <span className="logo-text">{navLabels.logotext}</span> */}
            <img src={swayamkrush}  alt="swayamkrush" className="swayamkrush-mobile" />
          </div>
          <button
            className="menu-button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </button>
        </div>

        {showMobileMenu && (
          <div className="mobile-menu">
            <ul>
              <li onClick={() => goTo("/")}>{navLabels.home}</li>

              <li onClick={() => setShowMobileDropdown((prev) => !prev)}>
                {navLabels.services} ▾
              </li>
              {showMobileDropdown && (
                <ul className="mobile-dropdown">
                  <li
                    onClick={() => {
                      if (!isLogin) {
                        alert("Please login to access this service.");
                        goTo("/login");
                      } else {
                        goTo("/services/firm-registration");
                      }
                    }}
                  >
                    {navLabels.servicesList?.firm}
                  </li>
                  <li
                    onClick={() => {
                      if (!isLogin) {
                        alert("Please login to access this service.");
                        goTo("/login");
                      } else {
                        goTo("/services/cibil-repair");
                      }
                    }}
                  >
                    {navLabels.servicesList?.cibilRepair}
                  </li>
                  <li
                    onClick={() => {
                      if (!isLogin) {
                        alert("Please login to access this service.");
                        goTo("/login");
                      } else {
                        goTo("/services/cibil-training");
                      }
                    }}
                  >
                    {navLabels.servicesList?.cibilTraining}
                  </li>
                  <li
                    onClick={() => {
                      if (!isLogin) {
                        alert("Please login to access this service.");
                        goTo("/login");
                      } else {
                        goTo("/services/visa");
                      }
                    }}
                  >
                    {navLabels.servicesList?.visa}
                  </li>

                  <li onClick={() => goTo("/services/msme")}>MSME</li>
                </ul>
              )}
              <li onClick={() => goTo("/privacy-policy")}>
                {navLabels.privacy}
              </li>
              <li onClick={() => goTo("/faq")}>{navLabels.faq}</li>
              <li onClick={() => goTo("/terms&conditions")}>
                {navLabels.terms}
              </li>
              {!isLogin && (
                <li onClick={() => goTo("/signup")}>{navLabels.signup}</li>
              )}
              {!isLogin && (
                <li onClick={() => goTo("/login")}>{navLabels.login}</li>
              )}
              {isLogin && <li onClick={handleLogout}>Logout</li>}
              {isAdmin && (
                <li
                  onClick={() => {
                    goTo("/admin");
                  }}
                >
                  Admin
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // DESKTOP NAVBAR
  return (
    <div className="nav">
      <div className="nav-header">
        <div className="logo-container">
          <div>
            <div>
              <img
                src={logo}
                alt="logo"
                style={{ cursor: "pointer" }}
                onClick={() => goTo("/")}
              />
              {/* <span
                className="logo-text"
                style={{ cursor: "pointer" }}
                onClick={() => goTo("/")}
              >
                {navLabels.logotext}
              </span> */}
            </div>
            <div className="swayamkrush-center">
              <img src={swayamkrush} alt="swayamkrush" />
            </div>
          </div>
          <div className="nav-bar">
            <ul className="navbar-menu">
              <li>
                <span onClick={() => goTo("/")}>{navLabels.home}</span>
              </li>

              <li className="dropdown">
                <span>{navLabels.services} ▾</span>
                <ul className="dropdown-content">
                  <li>
                    <span
                      onClick={() => {
                        if (!isLogin) {
                          alert(
                            "Please login to access this service. Redirecting to login page."
                          );
                          goTo("/login");
                        } else {
                          goTo("/services/firm-registration");
                        }
                      }}
                    >
                      {navLabels.servicesList?.firm}
                    </span>
                  </li>

                  <li>
                    <span
                      onClick={() => {
                        if (!isLogin) {
                          alert("Please login to access this service.");
                          goTo("/login");
                        } else {
                          goTo("/services/cibil-repair");
                        }
                      }}
                    >
                      {navLabels.servicesList?.cibilRepair}
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => {
                        if (!isLogin) {
                          alert("Please login to access this service.");
                          goTo("/login");
                        } else {
                          goTo("/services/cibil-training");
                        }
                      }}
                    >
                      {navLabels.servicesList?.cibilTraining}
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => {
                        if (!isLogin) {
                          alert("Please login to access this service.");
                          goTo("/login");
                        } else {
                          goTo("/services/visa");
                        }
                      }}
                    >
                      {navLabels.servicesList?.visa}
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => {
                        if (!isLogin) {
                          alert("Please login to access this service.");
                          goTo("/login");
                        } else {
                          goTo("/services/msme");
                        }
                      }}
                    >
                      MSME
                    </span>
                  </li>
                </ul>
              </li>

              <li>
                <span onClick={() => goTo("/privacy-policy")}>
                  {navLabels.privacy}
                </span>
              </li>
              <li>
                <span onClick={() => goTo("/faq")}>{navLabels.faq}</span>
              </li>
              <li>
                <span onClick={() => goTo("/terms&conditions")}>
                  {navLabels.terms}
                </span>
              </li>
              {!isLogin && (
                <li>
                  <span onClick={() => goTo("/signup")}>
                    {navLabels.signup}
                  </span>
                </li>
              )}
              {!isLogin && (
                <li>
                  <span onClick={() => goTo("/login")}>{navLabels.login}</span>
                </li>
              )}

              {/* ADD LOGOUT OPTION FOR DESKTOP */}
              {isLogin && (
                <li>
                  <span onClick={handleLogout}>Logout</span>
                </li>
              )}
              {isAdmin && (
                <li>
                  <span
                    onClick={() => {
                      goTo("/admin");
                    }}
                  >
                    {" "}
                    Admin
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
