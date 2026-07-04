import Sales from "../Models/Sales.Models.js";
import Employee from "../Models/Employee.Models.js";
import Product from "../Models/Product.Models.js";

export const createSale = async (req, res) => {
  try {
    const { productId, doctorId, quantity, totalPrice } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const newSale = new Sales({
      productId,
      doctorId,
      employeeId: req.user.employeeId,
      quantity,
      unitPrice: product.price,
      totalPrice: totalPrice,
    });

    const savedSale = await newSale.save();

    res.status(201).json(savedSale);
  } catch (error) {
    res.status(500).json({
      message: "Error creating sale",
      error: error.message,
    });
  }
};

export const getSales = async (req, res) => {
  try {
    const userRole = req.user.role;

    const { employee, doctor, product, from, to, state, city } = req.query;

    const filter = {};

    // ---------------- Role Based Filtering ----------------

    if (userRole === "OWNER") {
      // OWNER can see everything
    } else if (userRole === "RBM") {
      const employeeIds = await Employee.find({
        RBM: req.user.employeeId,
      }).select("_id");

      filter.employeeId = {
        $in: employeeIds.map((e) => e._id),
      };
    } else if (userRole === "ABM") {
      const employeeIds = await Employee.find({
        ABM: req.user.employeeId,
      }).select("_id");

      filter.employeeId = {
        $in: employeeIds.map((e) => e._id),
      };
    } else if (userRole === "EMPLOYEE") {
      filter.employeeId = req.user.employeeId;
    } else {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // ---------------- Employee Filter ----------------

    if (employee) {
      if (filter.employeeId?.$in) {
        filter.employeeId = {
          $in: filter.employeeId.$in.filter((id) => id.toString() === employee),
        };
      } else {
        filter.employeeId = employee;
      }
    }

    // ---------------- Doctor Filter ----------------

    if (doctor) {
      filter.doctorId = doctor;
    }

    // ---------------- Product Filter ----------------

    if (product) {
      filter.productId = product;
    }

    // ---------------- Date Filter ----------------

    if (from || to) {
      filter.date = {};

      if (from) {
        filter.date.$gte = new Date(from);
      }

      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    // ---------------- State / City Filter ----------------

    if (state || city) {
      // ABM is not allowed to filter by state
      if (userRole === "ABM" && state) {
        return res.status(403).json({
          message: "ABM can filter only by city.",
        });
      }

      const employeeFilter = {};

      // Restrict search to employees already allowed by role
      if (filter.employeeId) {
        if (filter.employeeId.$in) {
          employeeFilter._id = {
            $in: filter.employeeId.$in,
          };
        } else {
          employeeFilter._id = filter.employeeId;
        }
      }

      if (state) {
        employeeFilter["location.state"] = state;
      }

      if (city) {
        const cities = Array.isArray(city) ? city : [city];

        employeeFilter["location.city"] = {
          $in: cities,
        };
      }

      const employees = await Employee.find(employeeFilter).select("_id");

      filter.employeeId = {
        $in: employees.map((emp) => emp._id),
      };
    }

    // ---------------- Fetch Sales ----------------

    const sales = await Sales.find(filter)
      .populate("employeeId", "name location")
      .populate("doctorId", "name")
      .populate("productId", "name price")
      .sort({ date: -1 });

    res.status(200).json(sales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching sales",
    });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.saleId)
      .populate("productId")
      .populate("employeeId")
      .populate("doctorId");

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error });
  }
};
