import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminMedicinePage from "./pages/AdminMedicinePage.jsx";
import DoctorPrescriptionPage from "./pages/DoctorPrescriptionPage.jsx";
import PatientMedicationOrderingPage from "./pages/PatientMedicationOrderingPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/medicines" element={<AdminMedicinePage />} />
      <Route path="/doctor/prescriptions" element={<DoctorPrescriptionPage />} />
      <Route path="/patient/medication-ordering" element={<PatientMedicationOrderingPage />} />
      <Route path="/patient/prescriptions" element={<PatientMedicationOrderingPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
