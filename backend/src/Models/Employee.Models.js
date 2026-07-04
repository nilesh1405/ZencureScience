import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Invalid phone number"],
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    DOB: {
      type: Date,
      required: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    location: {
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
      },
      assignedCities: [
        {
          type: String,
        },
      ],
    },
    role: {
      type: String,
      enum: ["RBM", "ABM", "EMPLOYEE"],
      required: true,
    },
    ABM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    RBM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Employee", employeeSchema);
