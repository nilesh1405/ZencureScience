import React from "react";

export default function Card({ doctor }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 break-words">
          {doctor.name}
        </h2>

        <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-700">
          {doctor.doctorClass}
        </span>
      </div>

      <div className="space-y-2 text-sm sm:text-base text-gray-600 break-words">
        <p>
          <strong>Specialization:</strong> {doctor.specialization}
        </p>

        <p>
          <strong>Phone:</strong> {doctor.contactInfo?.phone}
        </p>

        <p>
          <strong>Email:</strong> {doctor.contactInfo?.email || "N/A"}
        </p>

        <p>
          <strong>Address:</strong> {doctor.address}
        </p>

        <p>
          <strong>HQ:</strong> {doctor.HQ}
        </p>
      </div>
    </div>
  );
}
