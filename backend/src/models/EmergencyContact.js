import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  relationship: { type: String, required: true, trim: true },
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    primary: {
      type: contactSchema,
      required: true,
    },
    secondary: {
      type: contactSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export const EmergencyContact = mongoose.model("EmergencyContact", emergencyContactSchema);
