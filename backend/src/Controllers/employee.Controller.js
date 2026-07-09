import Employee from "../Models/Employee.Models.js";
import User from "../Models/User.Models.js";
import bcrypt from "bcryptjs";
import {
  generateUsername,
  generatePassword,
} from "../lib/generateCredentials.js";
import {
  isValidEmail,
  isValidDOB,
  validateName,
  validatePhone,
} from "../lib/validator.js";
import { sendEmployeeCredentials } from "../lib/mail.js";

export const addEmployee = async (req, res) => {
  try {
    const { name, contactInfo, DOB, dateOfJoining, location } = req.body;
    const { role, employeeId } = req.user;

    const email = contactInfo?.email;
    const phone = contactInfo?.phone;

    if (!name || !phone || !email || !DOB || !dateOfJoining) {
      return res.status(400).json({
        message: "All required fields are missing.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        message: "Invalid phone number format",
      });
    }

    if (!isValidDOB(DOB)) {
      return res.status(400).json({
        message: "Invalid date of birth",
      });
    }

    if (!validateName(name)) {
      return res.status(400).json({
        message: "Invalid name format",
      });
    }

    const exists = await Employee.findOne({
      "contactInfo.phone": phone,
    });

    if (exists) {
      return res.status(409).json({
        message: "Employee already exists",
      });
    }

    const employeeData = {
      name,
      contactInfo,
      DOB,
      dateOfJoining,
    };

    if (role === "OWNER") {
      if (!location.state) {
        return res.status(400).json({
          message: "State is required.",
        });
      }
      const existingRBM = await Employee.findOne({
        role: "RBM",
        "location.state": location.state,
      });

      if (existingRBM) {
        return res.status(409).json({
          message: "An RBM is already assigned to this state.",
        });
      }

      employeeData.role = "RBM";

      if (location.city || location.assignedCities?.length) {
        return res.status(400).json({
          message: "RBM should only have a state.",
        });
      }

      employeeData.location = {
        state: location.state,
      };
    } else if (role === "RBM") {
      if (!location.assignedCities || location.assignedCities.length === 0) {
        return res.status(400).json({
          message: "ABM must have at least one assigned city.",
        });
      }

      const uniqueCities = [...new Set(location.assignedCities)];

      if (uniqueCities.length !== location.assignedCities.length) {
        return res.status(400).json({
          message: "Duplicate cities are not allowed.",
        });
      }

      const rbm = await Employee.findById(employeeId);

      if (!rbm) {
        return res.status(404).json({
          message: "RBM not found.",
        });
      }

      employeeData.role = "ABM";
      employeeData.RBM = employeeId;

      employeeData.location = {
        state: rbm.location.state,
        assignedCities: uniqueCities,
      };
    } else if (role === "ABM") {
      if (!location.city) {
        return res.status(400).json({
          message: "Employee must belong to one city.",
        });
      }

      const abm = await Employee.findById(employeeId);

      if (!abm) {
        return res.status(404).json({
          message: "ABM not found.",
        });
      }

      if (!abm.location.assignedCities.includes(location.city)) {
        return res.status(400).json({
          message: "Employee city is not assigned to this ABM.",
        });
      }

      employeeData.role = "EMPLOYEE";
      employeeData.ABM = employeeId;
      employeeData.RBM = abm.RBM;

      employeeData.location = {
        state: abm.location.state,
        city: location.city,
      };
    } else {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const newEmployee = await Employee.create(employeeData);

    const username = generateUsername(newEmployee.name, newEmployee._id);

    const password = generatePassword();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      employeeId: newEmployee._id,
      role: newEmployee.role,
    });
    try {
      await sendEmployeeCredentials({
        email: employeeData.contactInfo.email,
        name: employeeData.name,
        username,
        password,
      });
    } catch (err) {
      console.log("Couldn't send email:", err);
    }
    if (!newUser) {
      await Employee.findByIdAndDelete(newEmployee._id);

      return res.status(500).json({
        message: "Failed to create user for the employee",
      });
    }

    res.status(201).json({
      message: "Employee & User created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const { role, employeeId } = req.user;

    let filter = {};
    if (role === "EMPLOYEE") {
      filter._id = employeeId;
    } else if (role === "ABM") {
      filter.ABM = employeeId;
    } else if (role === "RBM") {
      const abms = await Employee.find({ RBM: employeeId }).select("_id");
      filter.ABM = { $in: abms.map((a) => a._id) };
    }
    const employees = await Employee.find(filter);

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error in getAllEmployees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { role } = req.user;
    const loggedInEmployee = req.user.employeeId; // Populated Employee document
    const loggedInEmployeeId = loggedInEmployee._id.toString();

    const { id } = req.params;

    // Fetch requested employee
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // Everyone can fetch themselves
    if (employee._id.toString() === loggedInEmployeeId) {
      return res.status(200).json(employee);
    }

    // OWNER can fetch anyone
    if (role === "OWNER") {
      return res.status(200).json(employee);
    }

    // EMPLOYEE cannot fetch anyone else
    if (role === "EMPLOYEE") {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // ABM can fetch only employees under them
    if (role === "ABM") {
      if (
        employee.role === "EMPLOYEE" &&
        employee.ABM &&
        employee.ABM.toString() === loggedInEmployeeId
      ) {
        return res.status(200).json(employee);
      }

      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // RBM can fetch their ABMs and Employees
    if (role === "RBM") {
      // Fetch ABM
      if (
        employee.role === "ABM" &&
        employee.RBM &&
        employee.RBM.toString() === loggedInEmployeeId
      ) {
        return res.status(200).json(employee);
      }

      // Fetch Employee
      if (
        employee.role === "EMPLOYEE" &&
        employee.RBM &&
        employee.RBM.toString() === loggedInEmployeeId
      ) {
        return res.status(200).json(employee);
      }

      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    return res.status(403).json({
      message: "Unauthorized",
    });
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { role, employeeId } = req.user;
    let filter = { _id: req.params.id };
    if (role === "EMPLOYEE") {
      filter._id = employeeId;
    } else if (role === "ABM") {
      filter.ABM = employeeId;
    } else if (role === "RBM") {
      const abms = await Employee.find({ RBM: employeeId }).select("_id");
      filter.ABM = { $in: abms.map((a) => a._id) };
    }
    const employee = await Employee.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found or unauthorized" });
    }
    res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { role, employeeId } = req.user;
    let filter = { _id: req.params.id };
    if (role === "EMPLOYEE") {
      filter._id = employeeId;
    } else if (role === "ABM") {
      filter.ABM = employeeId;
    } else if (role === "RBM") {
      const abms = await Employee.find({ RBM: employeeId }).select("_id");
      filter.ABM = { $in: abms.map((a) => a._id) };
    }
    const employee = await Employee.findOneAndDelete(filter);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found or unauthorized" });
    }
    await User.findOneAndDelete({ employee: employee._id });
    res
      .status(200)
      .json({ message: "Employee and associated User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findEmployees = async (req, res) => {
  try {
    const { role, employeeId } = req.user;
    const { search } = req.query;

    let filter = {};

    if (role === "OWNER") {
    } else if (role === "RBM") {
      const abms = await Employee.find({ RBM: employeeId }).select("_id");

      const employees = await Employee.find({
        ABM: { $in: abms.map((a) => a._id) },
      }).select("_id");

      filter.$or = [
        { _id: { $in: abms.map((a) => a._id) } },
        { _id: { $in: employees.map((e) => e._id) } },
      ];
    } else if (role === "ABM") {
      const employees = await Employee.find({ ABM: employeeId }).select("_id");

      filter.$or = [{ _id: { $in: employees.map((e) => e._id) } }];
    }

    if (search) {
      filter.$and = [
        filter.$or ? { $or: filter.$or } : {},
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { HQ: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
            { "contactInfo.phone": { $regex: search, $options: "i" } },
            { "contactInfo.email": { $regex: search, $options: "i" } },
          ],
        },
      ];
      delete filter.$or;
    }

    const employees = await Employee.find(filter)
      .populate("ABM", "name")
      .populate("RBM", "name");

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error in findEmployees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAssignedCities = async (req, res) => {
  try {
    if (req.user.role === "OWNER") {
      const cities = await Employee.distinct("location.city", {
        "location.city": { $exists: true, $ne: "" },
      });

      return res.json({ cities });
    }
    const employee = await Employee.findById(req.user.employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    if (employee.role === "ABM") {
      return res.json({
        cities: employee.location.assignedCities,
      });
    }

    if (employee.role === "RBM") {
      const employees = await Employee.find({
        RBM: employee._id,
      });

      const cities = [
        ...new Set(employees.map((e) => e.location.city).filter(Boolean)),
      ];

      return res.json({ cities });
    }

    return res.json({
      cities: [],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
