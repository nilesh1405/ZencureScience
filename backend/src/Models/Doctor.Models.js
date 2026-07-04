import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  specialization: {
    type: String,
    required: true,
    index: true
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid phone number"]
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  DOB: {
    type: Date,
    required: true
  },
  DOM: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  doctorClass: {
    type: String,
    required: true
  },
  HQ: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    index: true
  }
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);