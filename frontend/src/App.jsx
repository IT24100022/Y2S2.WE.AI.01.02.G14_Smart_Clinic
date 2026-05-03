import React, { useState } from 'react';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, userData) => {
    setUser({ ...userData, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MedicalRecordsPage user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
