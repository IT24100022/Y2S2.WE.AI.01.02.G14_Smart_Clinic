import React, { useState } from 'react';
import medicalRecordService from '../services/medicalRecordService';
import DeleteRecord from './DeleteRecord';

const PatientHistoryList = ({ role, onEditClick, externalRecords, setExternalRecords }) => {
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' or 'inventory'

  const filteredRecords = externalRecords.filter(record => {
    if (activeTab === 'inventory') return record.record_type === 'inventory';
    return record.record_type !== 'inventory';
  });

  const handleSearch = async (e, clearTerm = false) => {
    if (e) e.preventDefault();
    
    let currentId = patientId;
    if (clearTerm) {
      currentId = '';
      setPatientId('');
    }

    setLoading(true);
    setErrorStatus('');

    try {
      let results;
      // If admin/doctor and search term is empty, fetch all
      if ((role === 'admin' || role === 'doctor') && !currentId.trim()) {
        results = await medicalRecordService.getAllRecords(role);
      } else {
        results = await medicalRecordService.getPatientHistory(currentId.trim(), role);
      }
      setExternalRecords(results);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'No records found for this criteria';
      setErrorStatus(errorMsg);
      setExternalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = (deletedRecordId) => {
    setExternalRecords(prev => prev.filter(r => r._id !== deletedRecordId));
  };

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card" style={{ marginTop: '2rem', padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: activeTab === 'inventory' ? '#fff7ed' : '#f0fdf4', color: activeTab === 'inventory' ? '#f97316' : '#10b981', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            {activeTab === 'inventory' ? '📦' : '📄'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{activeTab === 'inventory' ? 'Inventory Log' : 'Patient History'}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{activeTab === 'inventory' ? 'Stock and asset registry' : 'Unified medical record repository'}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', background: '#f1f1f1', padding: '4px', borderRadius: '12px' }}>
          <button 
            className="btn" 
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', background: activeTab === 'patients' ? 'white' : 'transparent', fontWeight: '800', color: activeTab === 'patients' ? 'var(--text-main)' : '#86868b' }}
            onClick={() => setActiveTab('patients')}
          >
            PATIENTS
          </button>
          <button 
            className="btn" 
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', background: activeTab === 'inventory' ? 'white' : 'transparent', fontWeight: '800', color: activeTab === 'inventory' ? 'var(--text-main)' : '#86868b' }}
            onClick={() => setActiveTab('inventory')}
          >
            INVENTORY
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input 
            type="text" 
            className="form-input" 
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder={activeTab === 'inventory' ? "Search Asset ID..." : "Enter Patient ID (e.g. PAT-001)"}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '0 2.5rem' }} disabled={loading || (!patientId && role !== 'admin' && role !== 'doctor')}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" className="btn btn-secondary" style={{ padding: '0 2rem' }} onClick={() => handleSearch(null, true)}>
          View All
        </button>
      </form>

      {errorStatus && (
        <div className="message error">
          {errorStatus}
        </div>
      )}

      {filteredRecords.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{activeTab === 'inventory' ? 'Item/Asset' : 'Patient / Title'}</th>
                <th>{activeTab === 'inventory' ? 'Stock Info' : 'Type'}</th>
                <th>Date</th>
                <th>{activeTab === 'inventory' ? 'Manufacturer' : 'Description'}</th>
                <th>Registry By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record._id}>
                  <td style={{ fontWeight: 600 }}>
                    {activeTab === 'inventory' ? record.product_name : (
                      <div>
                        {record.patient_name || 'Anonymous'}<br/>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{record.title || 'Untitled'}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {activeTab === 'inventory' ? (
                       <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Qty: {record.quantity || '0'}</span>
                    ) : (
                      <span className="dot" style={{ 
                        display: 'inline-block',
                        background: record.record_type === 'xray' ? '#3b82f6' : 
                                    record.record_type === 'photo' ? '#10b981' :
                                    record.record_type === 'report' ? '#f59e0b' :
                                    record.record_type === 'schedule' ? '#8b5cf6' : '#f97316'
                      }}></span>
                    )} {activeTab === 'inventory' ? '' : record.record_type}
                  </td>
                  <td>{formatDate(record.record_date)}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }}>
                    {activeTab === 'inventory' ? record.supplier : record.description}
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{record.doctor_id}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => onEditClick(record)}>Edit</button>
                      {role === 'admin' && (
                        <DeleteRecord role={role} recordId={record._id} onDeleteSuccess={handleDeleteSuccess} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ background: '#fffbeb', display: 'inline-flex', width: '80px', height: '80px', borderRadius: '24px', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '2rem', border: '1px solid #fde68a' }}>
              🙁
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '800' }}>No {activeTab} found</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>Double-check your filters and try again</p>
          </div>
        )
      )}
    </div>
  );
};

export default PatientHistoryList;
