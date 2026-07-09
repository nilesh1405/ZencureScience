import React from "react";

export default function EmployeeCard({ employee }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 break-words">
          {employee.name}
        </h2>
      </div>

      <div className="space-y-2 text-sm sm:text-base text-gray-600 break-words">
        <p>
          <strong>Phone:</strong> {employee.contactInfo?.phone}
        </p>

        <p>
          <strong>Email:</strong> {employee.contactInfo?.email || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {employee.role || "N/A"}
        </p>
      </div>
    </div>
  );
}
