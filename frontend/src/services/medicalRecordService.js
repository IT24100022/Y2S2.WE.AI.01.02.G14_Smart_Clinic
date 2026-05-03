import axios from 'axios';

const API_URL = 'http://localhost:8088/api/records';

// Setup common config
const getConfig = (role) => ({
  headers: {
    'x-user-role': role
  }
});

const medicalRecordService = {
  // CREATE
  createRecord: async (data, role) => {
    const response = await axios.post(API_URL, data, getConfig(role));
    return response.data;
  },
  // READ ALL (Admin/Testing)
  getAllRecords: async (role) => {
    const response = await axios.get(API_URL, getConfig(role));
    return response.data;
  },

  // READ PATIENT HISTORY
  getPatientHistory: async (patientId, role) => {
    const response = await axios.get(`${API_URL}/patient/${patientId}`, getConfig(role));
    return response.data;
  },

  // UPDATE
  updateRecord: async (id, data, role) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getConfig(role));
    return response.data;
  },

  // DELETE
  deleteRecord: async (id, role) => {
    const response = await axios.delete(`${API_URL}/${id}`, getConfig(role));
    return response.data;
  }
};

export default medicalRecordService;
