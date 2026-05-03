import React, { useState } from 'react';
import medicalRecordService from '../services/medicalRecordService';

const DeleteRecord = ({ role, recordId, onDeleteSuccess }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  // Only render if role is admin
  if (role !== 'admin') {
    return null;
  }

  const handleDelete = async () => {
    setLoading(true);
    setErrorStatus('');
    try {
      await medicalRecordService.deleteRecord(recordId, role);
      setShowConfirm(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(recordId);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete record';
      setErrorStatus(errorMsg);
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="btn btn-danger" 
        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} 
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </button>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Deletion</h2>
            
            {errorStatus && (
              <div className="message error">
                {errorStatus}
              </div>
            )}
            
            <p style={{ margin: '1rem 0' }}>
              Are you sure you want to logically delete this record? This action can only be undone by an administrator accessing the database directly.
            </p>
            
            <div className="flex-row" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteRecord;
