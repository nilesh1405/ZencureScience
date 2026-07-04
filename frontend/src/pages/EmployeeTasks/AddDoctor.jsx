import React, { useState } from "react";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showSuccess, showError } from "../../lib/toast";

export default function AddDoctor() {
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.sideBar);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contactInfo: {
      phone: "",
      email: "",
    },
    DOB: "",
    DOM: "",
    address: "",
    doctorClass: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/doctors/addDoctor", formData);
      showSuccess("Doctor added successfully!");
      navigate("/doctors");
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message);
    }
  };

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-5 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0 overflow-y-auto`}
    >
      <div className="w-full rounded-2xl p-2 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Add Doctor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-medium">Doctor Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block mb-2 font-medium">Date of Marriage</label>
              <input
                type="date"
                name="DOM"
                value={formData.DOM}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Address</label>
            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Doctor Class</label>

            <select
              name="doctorClass"
              value={formData.doctorClass}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Class</option>
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add Doctor
          </button>
        </form>
      </div>
    </div>
  );
}
