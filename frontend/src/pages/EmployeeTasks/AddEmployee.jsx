import React, { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showSuccess, showError } from "../../lib/toast";

export default function AddEmployee() {
  const navigate = useNavigate();

  const isOpen = useSelector((state) => state.ui.sideBar);
  const user = useSelector((state) => state.auth.user);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactInfo: {
      phone: "",
      email: "",
    },
    DOB: "",
    dateOfJoining: "",
    location: {
      state: "",
      city: "",
      assignedCities: [],
    },
  });

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/company/${user.employeeId}`);
        setEmployee(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.employeeId) {
      fetchEmployee();
    }
  }, [user]);

  useEffect(() => {
    if (user.role === "OWNER") {
      fetchStates();
      return;
    }

    if (!employee) return;

    if (user.role === "RBM") {
      fetchCities(employee.location.state);
    }

    if (user.role === "ABM") {
      setCities(employee.location.assignedCities || []);
    }
  }, [employee, user.role]);

  const fetchStates = async () => {
    try {
      const { data } = await api.get("/location/states");
      setStates(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCities = async (state) => {
    try {
      setLoadingCities(true);

      const { data } = await api.get(`/location/cities/${state}`);

      setCities(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "email") {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [name]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = async (e) => {
    const state = e.target.value;

    setFormData((prev) => ({
      ...prev,
      location: {
        state,
        city: "",
        assignedCities: [],
      },
    }));

    await fetchCities(state);
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: e.target.value,
      },
    }));
  };

  const handleAssignedCities = (e) => {
    const city = e.target.value;

    if (!city) return;

    setFormData((prev) => {
      if (prev.location.assignedCities.includes(city)) return prev;

      return {
        ...prev,
        location: {
          ...prev.location,
          assignedCities: [...prev.location.assignedCities, city],
        },
      };
    });

    e.target.value = "";
  };

  const removeCity = (cityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        assignedCities: prev.location.assignedCities.filter(
          (city) => city !== cityToRemove,
        ),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/company/addEmployee", formData);

      showSuccess("Employee added successfully");

      navigate("/employees");
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message);
    }
  };

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-6 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0 overflow-y-auto`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Add Employee
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 font-medium">Employee Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.contactInfo.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        {/* DOB + DOJ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">Date of Birth</label>

            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Date of Joining</label>

            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              max={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        {/* OWNER */}
        {user.role === "OWNER" && (
          <div>
            <label className="block mb-2 font-medium">State</label>

            <select
              value={formData.location.state}
              onChange={handleStateChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select State</option>

              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* RBM */}
        {user.role === "RBM" && (
          <div>
            <label className="block mb-2 font-medium">Assign Cities</label>

            {loadingCities ? (
              <div className="border rounded-lg p-3">Loading cities...</div>
            ) : (
              <>
                <select
                  onChange={handleAssignedCities}
                  defaultValue=""
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select City</option>

                  {cities.map((city) => (
                    <option
                      key={city}
                      value={city}
                      disabled={formData.location.assignedCities.includes(city)}
                    >
                      {city}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-4 max-h-40 overflow-y-auto">
                  {formData.location.assignedCities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{city}</span>

                      <button
                        type="button"
                        onClick={() => removeCity(city)}
                        className="ml-2 font-bold hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ABM */}
        {user.role === "ABM" && (
          <div>
            <label className="block mb-2 font-medium">City</label>

            <select
              value={formData.location.city}
              onChange={handleCityChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select City</option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}
