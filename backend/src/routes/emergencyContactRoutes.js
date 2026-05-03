import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getMyEmergencyContacts,
  upsertMyEmergencyContacts,
  getPatientEmergencyForDoctor,
  deletePatientEmergencyForDoctor,
  getAllEmergencyContacts,
  adminUpdateEmergencyContact,
  adminDeleteEmergencyContact,
} from "../controllers/emergencyContactController.js";

const router = express.Router();

// ── Patient routes ────────────────────────────────────────────────────────────
router.get("/my", verifyToken, getMyEmergencyContacts);
router.put("/my", verifyToken, upsertMyEmergencyContacts);

// ── Doctor routes (view & delete only) ───────────────────────────────────────
router.get("/patient/:patient_id", verifyToken, getPatientEmergencyForDoctor);
router.delete("/patient/:patient_id", verifyToken, deletePatientEmergencyForDoctor);

// ── Admin routes (full CRUD) ──────────────────────────────────────────────────
router.get("/admin/all", verifyToken, getAllEmergencyContacts);
router.put("/admin/:id", verifyToken, adminUpdateEmergencyContact);
router.delete("/admin/:id", verifyToken, adminDeleteEmergencyContact);

export default router;
