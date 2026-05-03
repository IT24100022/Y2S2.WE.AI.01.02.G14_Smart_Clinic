import React, { useState, useEffect, useRef } from 'react';
import medicalRecordService from '../services/medicalRecordService';

const EditRecordForm = ({ role, record, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    patient_contact: '',
    sex: 'Male',
    doctor_id: '',
    record_type: 'report',
    title: '',
    description: '',
    file_url: '',
    record_date: '',
    quantity: '1',
    supplier: 'Global Medical Supplies',
    serial_number: '',
    product_name: 'Surgical Mask (Box of 50)'
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (record) {
      setFormData({
        patient_id: record.patient_id || '',
        patient_name: record.patient_name || '',
        patient_contact: record.patient_contact || '',
        sex: record.sex || 'Male',
        doctor_id: record.doctor_id || '',
        record_type: record.record_type || 'report',
        title: record.title || '',
        description: record.description || '',
        file_url: record.file_url || '',
        record_date: record.record_date ? new Date(record.record_date).toISOString().split('T')[0] : '',
        quantity: record.quantity ? String(record.quantity) : '1',
        supplier: record.supplier || 'Global Medical Supplies',
        serial_number: record.serial_number || '',
        product_name: record.product_name || 'Surgical Mask (Box of 50)'
      });
    }
  }, [record]);

  const isInventory = formData.record_type === 'inventory';

  const PRODUCTS = [
    'Surgical Mask (Box of 50)',
    'Nitrile Gloves (Large)',
    'Hand Sanitizer (500ml)',
    'Digital Thermometer',
    'Blood Pressure Monitor',
    'Antiseptic Wipes (100pk)',
    'Disposable Aprons (Roll)'
  ];

  const SUPPLIERS = [
    'Global Medical Supplies',
    'HealthDirect Logistics',
    'PharmaNet Wholesale',
    'MediPlus Distributors',
    'SafeGuard Health'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file_url: file.name });
      setStatus({ type: 'success', message: `📎 New file attached: ${file.name}` });
    }
  };

  const validate = () => {
    if (!isInventory) {
      if (formData.patient_id.length !== 6) return 'Patient ID must be exactly 6 characters';
      if (formData.patient_contact.length !== 10 || !/^\d+$/.test(formData.patient_contact)) 
        return 'Contact number must be exactly 10 digits';
      if (!formData.patient_name) return 'Patient Name is required';
    } else {
      if (formData.serial_number && formData.serial_number.length !== 6) 
        return 'Serial Number must be exactly 6 characters';
      if (!formData.quantity || Number(formData.quantity) <= 0)
        return 'Quantity must be a positive number (minimum 1)';
    }

    if (formData.doctor_id.length !== 6) return 'Doctor ID must be exactly 6 characters';
    if (formData.description.length > 100) return 'Description must not exceed 100 characters';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validate();
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = { ...formData };
      if (isInventory) {
        payload.patient_id = formData.product_name;
        payload.quantity = Number(formData.quantity);
      }
      const updatedRecord = await medicalRecordService.updateRecord(record._id, payload, role);
      setStatus({ type: 'success', message: '✨ Record updated successfully!' });
      
      setTimeout(() => {
        if (onUpdate) onUpdate(updatedRecord);
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update record';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = {
    padding: '1.25rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    fontWeight: '700',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    animation: 'slideDown 0.3s ease-out',
    border: '1px solid'
  };

  if (!record) return null;

  return (
    <div className="card" style={{ padding: '2.5rem', border: '2px solid var(--primary)' }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#4338ca', color: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            ✎
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Update Entry</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Modifying existing record: {record._id}</p>
          </div>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel Changes</button>
      </div>
      
      {status.message && (
        <div style={{ 
          ...statusStyle, 
          background: status.type === 'success' ? '#f0fdf4' : '#fff1f0',
          color: status.type === 'success' ? '#16a34a' : '#cf1322',
          borderColor: status.type === 'success' ? '#bbf7d0' : '#ffa39e'
        }}>
          {status.type === 'success' ? '✅' : '❌'} {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />

        {!isInventory && (
          <div className="flex-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Patient ID (6 chars) *</label>
              <input 
                type="text" 
                name="patient_id" 
                className="form-input" 
                value={formData.patient_id} 
                onChange={handleChange} 
                maxLength={6}
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 1.2 }}>
              <label>Patient Name *</label>
              <input 
                type="text" 
                name="patient_name" 
                className="form-input" 
                value={formData.patient_name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Phone Number (10 digits) *</label>
              <input 
                type="tel" 
                name="patient_contact" 
                className="form-input" 
                value={formData.patient_contact} 
                onChange={handleChange} 
                maxLength={10}
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 0.8 }}>
              <label>Sex *</label>
              <select name="sex" className="form-input" value={formData.sex} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {isInventory && (
          <div className="flex-row">
            <div className="form-group" style={{ flex: 1.5 }}>
              <label>Product Name *</label>
              <select name="product_name" className="form-input" value={formData.product_name} onChange={handleChange}>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Manufacturer / Supplier *</label>
              <select name="supplier" className="form-input" value={formData.supplier} onChange={handleChange}>
                {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 0.5 }}>
              <label>Quantity *</label>
              <input 
                type="number" 
                name="quantity" 
                className="form-input" 
                value={formData.quantity} 
                onChange={handleChange} 
                min="1"
                required 
              />
            </div>
          </div>
        )}

        <div className="flex-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Doctor ID (6 chars) *</label>
            <input 
              type="text" 
              name="doctor_id" 
              className="form-input" 
              value={formData.doctor_id} 
              onChange={handleChange} 
              maxLength={6}
              required 
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Record Type *</label>
            <select 
              name="record_type" 
              className="form-input" 
              value={formData.record_type} 
              onChange={handleChange}
            >
              <option value="report">Report</option>
              <option value="xray">X-Ray</option>
              <option value="photo">Photo</option>
              <option value="schedule">Schedule</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Record Date *</label>
            <input 
              type="date" 
              name="record_date" 
              className="form-input" 
              value={formData.record_date} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        {isInventory && (
          <div className="flex-row" style={{ width: '33.33%' }}>
             <div className="form-group" style={{ flex: 1 }}>
              <label>Serial Number (6 chars)</label>
              <input 
                type="text" 
                name="serial_number" 
                className="form-input" 
                value={formData.serial_number} 
                onChange={handleChange} 
                maxLength={6}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ margin: 0 }}>Description (Max 100 characters) *</label>
            <span style={{ fontSize: '0.7rem', color: formData.description.length > 90 ? '#cf1322' : 'var(--text-muted)' }}>{formData.description.length}/100</span>
          </div>
          <textarea 
            name="description" 
            className="form-input" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            maxLength={100}
            style={{ minHeight: '60px' }}
          />
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Update Asset Image / File</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              name="file_url" 
              className="form-input" 
              value={formData.file_url} 
              onChange={handleChange} 
              placeholder="Or paste update link here..."
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => fileInputRef.current.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <span>↑</span> Change File
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem 2.5rem' }} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 3rem' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecordForm;
