import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import PatientEmergencyContacts from "./pages/patient/PatientEmergencyContacts.jsx";
import DoctorEmergencyContacts from "./pages/doctor/DoctorEmergencyContacts.jsx";
import AdminEmergencyContacts from "./pages/admin/AdminEmergencyContacts.jsx";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient */}
      <Route path="/patient/emergency-contacts" element={<PatientEmergencyContacts />} />

      {/* Doctor */}
      <Route path="/doctor/emergency-contacts" element={<DoctorEmergencyContacts />} />

      {/* Admin */}
      <Route path="/admin/emergency" element={<AdminEmergencyContacts />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
