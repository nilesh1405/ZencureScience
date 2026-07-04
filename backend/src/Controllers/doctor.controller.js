import Doctor from "../Models/Doctor.Models.js";
import Employee from "../Models/Employee.Models.js";
import mongoose from "mongoose";

export const addDoctor = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.employeeId);

    const {
      name,
      specialization,
      contactInfo,
      DOB,
      DOM,
      address,
      doctorClass,
    } = req.body;

    if (
      !name ||
      !specialization ||
      !contactInfo?.phone ||
      !DOB ||
      !DOM ||
      !address ||
      !doctorClass
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDoctor = await Doctor.create({
      name,
      specialization,
      contactInfo,
      DOB,
      DOM,
      address,
      doctorClass,
      HQ: "jaipur",
      addedBy: req.user.employeeId._id,
    });

    res.status(201).json(newDoctor);
  } catch (error) {
    console.dir(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { role, employeeId } = req.user;
    let filter = {};

    if (role === "EMPLOYEE") {
      filter.addedBy = employeeId;
    } else if (role === "ABM") {
      const employees = await Employee.find({ ABM: employeeId }).select("_id");
      const employeeIds = employees.map((e) => e._id);

      filter.addedBy = { $in: employeeIds };
    } else if (role === "RBM") {
      const abms = await Employee.find({ RBM: employeeId }).select("_id");

      const employees = await Employee.find({
        ABM: { $in: abms.map((a) => a._id) },
      }).select("_id");

      filter.addedBy = { $in: employees.map((e) => e._id) };
    }
    const doctors = await Doctor.find(filter).populate(
      "addedBy",
      "name HQ role",
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    res.status(500).json({ message: "Internal Server Error || Wrong Input" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({
      _id: req.params.id,
      addedBy: req.user.employeeId,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.log("Error in deleting Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id, addedBy: req.user.employeeId },
      req.body,
      { new: true },
      { runValidators: true },
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.log("Error in updating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findDoctors = async (req, res) => {
  try {
    const { role, employeeId } = req.user;
    const { search } = req.query;

    let filter = {};

    if (role === "EMPLOYEE") {
      filter.addedBy = employeeId;
    } else if (role === "ABM") {
      const employees = await Employee.find({ ABM: employeeId }).select("_id");
      filter.addedBy = { $in: employees.map((e) => e._id) };
    } else if (role === "RBM") {
      const abms = await Employee.find({ RBM: employeeId }).select("_id");

      const employees = await Employee.find({
        ABM: { $in: abms.map((a) => a._id) },
      }).select("_id");

      filter.addedBy = { $in: employees.map((e) => e._id) };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { "contactInfo.phone": { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(filter);

    res.status(200).json(doctors);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    const today = new Date();

    const events = [];

    doctors.forEach((doctor) => {
      const checkEvent = (date, type) => {
        if (!date) return;

        const eventDate = new Date(date);

        let nextOccurrence = new Date(
          today.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
        );

        if (nextOccurrence < today) {
          nextOccurrence.setFullYear(today.getFullYear() + 1);
        }

        const diffDays = Math.ceil(
          (nextOccurrence - today) / (1000 * 60 * 60 * 24),
        );

        if (diffDays <= 7) {
          events.push({
            id: `${doctor._id}-${type}`,
            doctorId: doctor._id,
            name: doctor.name,
            type,
            date: nextOccurrence,
            daysLeft: diffDays,
          });
        }
      };

      checkEvent(doctor.DOB, "birthday");
      checkEvent(doctor.marriageDate, "anniversary");
    });

    events.sort((a, b) => a.daysLeft - b.daysLeft);

    res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
