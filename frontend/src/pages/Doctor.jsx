import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../lib/axios.js";
import DoctorCard from "../components/common/Card.jsx";
import { useNavigate } from "react-router-dom";

export default function Doctor() {
  const isOpen = useSelector((state) => state.ui.sideBar);
  const user = useSelector((state) => state.auth.user);
  const role = user.role;
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await api.get(`/doctors/search?search=${search}`);
      setDoctors(res.data);
    };

    fetchDoctors();
  }, [search]);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);

        const res = await api.get("/doctors/getAllDoctors?limit=2");

        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  const handleClick = () => {
    navigate("/doctors/addDoctor");
  };

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-5 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0`}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Doctors
          </h1>

          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Manage all your doctors here
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            className="font-bold shadow rounded border px-4 py-2 w-full sm:w-auto"
            onClick={handleClick}
          >
            Add Doctor
          </button>

          <input
            type="text"
            placeholder="Find Doctor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-3 w-full sm:w-64"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center text-lg font-semibold">
          Loading doctors...
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-xl font-semibold">No doctors found</h2>

          <p className="mt-2 text-gray-500">Add some doctors to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
