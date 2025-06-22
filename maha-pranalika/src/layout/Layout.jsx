import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../components/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
const Layout = ({ children }) => {
  return (
    <>
     <LanguageProvider> 
      <LanguageSwitcher />
      <Navbar />
      
    
      

      <main>{children}</main>
      <Footer />
      </LanguageProvider>
    </>
  );
};

export default Layout;
