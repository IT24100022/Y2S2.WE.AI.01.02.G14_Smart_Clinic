import { EmergencyContact } from "../models/EmergencyContact.js";
import { User } from "../models/User.js";

// ─── helpers ────────────────────────────────────────────────────────────────

const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;

const validatePhone = (phone) => phoneRegex.test(phone);

// ─── PATIENT: get own emergency contacts ────────────────────────────────────

export const getMyEmergencyContacts = async (req, res) => {
  try {
    const { user_id } = req.user;
    const doc = await EmergencyContact.findOne({ patient_id: user_id });
    return res.status(200).json({ success: true, data: doc || null });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch emergency contacts", error: err.message });
  }
};

// ─── PATIENT: create / update own emergency contacts ────────────────────────

export const upsertMyEmergencyContacts = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { primary, secondary } = req.body;

    if (!primary || !primary.name || !primary.phone || !primary.relationship) {
      return res.status(400).json({ message: "Primary contact name, phone, and relationship are required" });
    }
    if (!validatePhone(primary.phone)) {
      return res.status(400).json({ message: "Primary contact phone number is invalid" });
    }

    // Primary phone must not match the patient's own profile phone
    const user = await User.findById(user_id);
    if (user?.phone && user.phone.replace(/\s/g, "") === primary.phone.replace(/\s/g, "")) {
      return res.status(400).json({ message: "Primary emergency contact phone cannot match your profile phone number" });
    }

    // Validate secondary if provided
    if (secondary) {
      if (!secondary.name || !secondary.phone || !secondary.relationship) {
        return res.status(400).json({ message: "Secondary contact name, phone, and relationship are all required" });
      }
      if (!validatePhone(secondary.phone)) {
        return res.status(400).json({ message: "Secondary contact phone number is invalid" });
      }
      if (secondary.phone.replace(/\s/g, "") === primary.phone.replace(/\s/g, "")) {
        return res.status(400).json({ message: "Secondary contact phone cannot be the same as primary" });
      }
    }

    const payload = {
      patient_id: user_id,
      primary,
      secondary: secondary || null,
    };

    const existing = await EmergencyContact.findOne({ patient_id: user_id });
    let doc;
    if (existing) {
      doc = await EmergencyContact.findOneAndUpdate({ patient_id: user_id }, payload, { new: true, runValidators: true });
    } else {
      doc = await EmergencyContact.create(payload);
    }

    return res.status(200).json({ success: true, message: "Emergency contacts saved", data: doc });
  } catch (err) {
    return res.status(500).json({ message: "Failed to save emergency contacts", error: err.message });
  }
};

// ─── DOCTOR: view emergency contacts for their booked patients ──────────────
// For now we fetch by patient_id directly (doctor passes patient_id as query param)
// In production this would join with an Appointments collection.

export const getPatientEmergencyForDoctor = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { patient_id } = req.params;
    const doc = await EmergencyContact.findOne({ patient_id })
      .populate("patient_id", "full_name email phone profile_image");

    if (!doc) return res.status(404).json({ message: "No emergency contacts found for this patient" });

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch emergency contact", error: err.message });
  }
};

// ─── DOCTOR: delete a patient's emergency contact record ────────────────────

export const deletePatientEmergencyForDoctor = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { patient_id } = req.params;
    const deleted = await EmergencyContact.findOneAndDelete({ patient_id });
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    return res.status(200).json({ success: true, message: "Emergency contact record deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete emergency contact", error: err.message });
  }
};

// ─── ADMIN: get all emergency contacts ──────────────────────────────────────

export const getAllEmergencyContacts = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const contacts = await EmergencyContact.find()
      .populate("patient_id", "full_name email phone profile_image status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch emergency contacts", error: err.message });
  }
};

// ─── ADMIN: update a patient's emergency contacts ───────────────────────────

export const adminUpdateEmergencyContact = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params; // EmergencyContact document _id
    const { primary, secondary } = req.body;

    if (!primary || !primary.name || !primary.phone || !primary.relationship) {
      return res.status(400).json({ message: "Primary contact name, phone, and relationship are required" });
    }
    if (!validatePhone(primary.phone)) {
      return res.status(400).json({ message: "Primary contact phone number is invalid" });
    }
    if (secondary) {
      if (!secondary.name || !secondary.phone || !secondary.relationship) {
        return res.status(400).json({ message: "Secondary contact fields are incomplete" });
      }
      if (!validatePhone(secondary.phone)) {
        return res.status(400).json({ message: "Secondary contact phone number is invalid" });
      }
    }

    const updated = await EmergencyContact.findByIdAndUpdate(
      id,
      { primary, secondary: secondary || null },
      { new: true, runValidators: true }
    ).populate("patient_id", "full_name email phone");

    if (!updated) return res.status(404).json({ message: "Record not found" });

    return res.status(200).json({ success: true, message: "Emergency contact updated", data: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update emergency contact", error: err.message });
  }
};

// ─── ADMIN: delete a patient's emergency contacts ───────────────────────────

export const adminDeleteEmergencyContact = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const deleted = await EmergencyContact.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    return res.status(200).json({ success: true, message: "Emergency contact deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete emergency contact", error: err.message });
  }
};
