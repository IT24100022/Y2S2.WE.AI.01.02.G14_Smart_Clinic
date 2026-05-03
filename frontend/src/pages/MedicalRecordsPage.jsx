import React, { useState } from 'react';
import AddRecordForm from '../components/AddRecordForm';
import PatientHistoryList from '../components/PatientHistoryList';
import EditRecordForm from '../components/EditRecordForm';

const MedicalRecordsPage = ({ user, onLogout }) => {
  const role = user.role;
  const [editingRecord, setEditingRecord] = useState(null);
  
  // We lift state here so that adding or updating can refresh the list if needed
  const [externalRecords, setExternalRecords] = useState([]);

  const handleEditClick = (record) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = (updatedRecord) => {
    // Update the record in the list if it's there
    setExternalRecords(prev => prev.map(rec => 
      rec._id === updatedRecord._id ? updatedRecord : rec
    ));
    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handleRecordAdded = (addedRecord) => {
    setExternalRecords(prev => [addedRecord, ...prev]);
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="user-pill">
            <span style={{ fontSize: '0.9rem' }}>👤</span>
            {user.name} ({user.email})
          </div>
          <div className="role-tag" style={{ background: role === 'admin' ? '#eef2ff' : '#f0fdf4', color: role === 'admin' ? '#4f46e5' : '#16a34a' }}>
            {role.toUpperCase()} DASHBOARD
          </div>
          <button className="btn btn-secondary" onClick={onLogout} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}>
            Logout
          </button>
        </div>
        
        <div className="legend">
          <div className="legend-item"><span className="dot" style={{ background: '#3b82f6' }}></span> X-Ray</div>
          <div className="legend-item"><span className="dot" style={{ background: '#10b981' }}></span> Photo</div>
          <div className="legend-item"><span className="dot" style={{ background: '#f59e0b' }}></span> Report</div>
          <div className="legend-item"><span className="dot" style={{ background: '#8b5cf6' }}></span> Schedule</div>
          <div className="legend-item"><span className="dot" style={{ background: '#f97316' }}></span> Inventory</div>
        </div>
      </div>

      <header className="header" style={{ marginBottom: '3rem', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1>{role === 'admin' ? 'Admin' : 'Doctor'} <span>Medical Vault</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
          Full System Access · Record Management & Governance
        </p>
      </header>

      <div className="grid">
        {editingRecord ? (
          <EditRecordForm 
            role={role} 
            record={editingRecord} 
            onCancel={handleCancelEdit} 
            onUpdate={handleUpdate} 
          />
        ) : (
          <AddRecordForm 
            role={role} 
            onRecordAdded={handleRecordAdded} 
          />
        )}
        
        <PatientHistoryList 
          role={role} 
          onEditClick={handleEditClick}
          externalRecords={externalRecords}
          setExternalRecords={setExternalRecords}
        />
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
