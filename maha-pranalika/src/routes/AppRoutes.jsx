import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import FAQ from '../pages/FAQ'
import Firmregistration from '../components/Firmregistration'
import Cibiltraining from '../components/Cibiltraining'
import CibilRepairForm from '../pages/CibilRepairForm'
import VisaOverseas from '../pages/VisaOverseas'
const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq"  element={<FAQ/>}/>
        <Route path="/services/firm-registration" element={<Firmregistration/>} />
        <Route path="/services/cibil-repair" element={<CibilRepairForm/>} />
        <Route path="/services/cibil-training" element={<Cibiltraining/>} />

        <Route path="/services/visa" element={<VisaOverseas/>} />
        {/* Add more routes as needed */}
      </Routes>
  )
}

export default AppRoutes