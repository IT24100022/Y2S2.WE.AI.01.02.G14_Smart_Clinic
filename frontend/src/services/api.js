import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const loginUser = (payload) => api.post("/auth/login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const getPatientSettings = (token) => 
  api.get("/auth/patient/settings", {
    headers: { Authorization: `Bearer ${token}` }
  });
export const updatePatientSettings = (payload, token) =>
  api.put("/auth/patient/settings", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

// ── Emergency Contacts ────────────────────────────────────────────────────────
export const getMyEmergencyContacts = (token) =>
  api.get("/emergency-contacts/my", { headers: { Authorization: `Bearer ${token}` } });

export const upsertMyEmergencyContacts = (payload, token) =>
  api.put("/emergency-contacts/my", payload, { headers: { Authorization: `Bearer ${token}` } });

export const getPatientEmergencyForDoctor = (patientId, token) =>
  api.get(`/emergency-contacts/patient/${patientId}`, { headers: { Authorization: `Bearer ${token}` } });

export const deletePatientEmergencyForDoctor = (patientId, token) =>
  api.delete(`/emergency-contacts/patient/${patientId}`, { headers: { Authorization: `Bearer ${token}` } });

export const adminGetAllEmergencyContacts = (token) =>
  api.get("/emergency-contacts/admin/all", { headers: { Authorization: `Bearer ${token}` } });

export const adminUpdateEmergencyContact = (id, payload, token) =>
  api.put(`/emergency-contacts/admin/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });

export const adminDeleteEmergencyContact = (id, token) =>
  api.delete(`/emergency-contacts/admin/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export default api;
