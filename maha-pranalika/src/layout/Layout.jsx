import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { LanguageProvider } from "../components/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isRootPath =
    location.pathname === "/signup" || location.pathname === "/login";
  // if (isRootPath) {
  //   return <main>{children}</main>;
  // }

  return (
    <>
      <LanguageProvider>
        {/* 🔵 Top Blue Bar with only LanguageSwitcher */}
        <div
          style={{
            backgroundColor: "#2d2a8e",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <LanguageSwitcher />
        </div>

        <Navbar />
        <main>{children}</main>
        <Footer />
      </LanguageProvider>
    </>
  );
};

export default Layout;
