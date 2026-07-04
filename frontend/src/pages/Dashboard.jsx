import React from "react";
import { useSelector } from "react-redux";
import Notification from "../components/layout/Notification.jsx";

export default function Dashboard() {
  const isOpen = useSelector((state) => state.ui.sideBar);

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-5 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0 overflow-y-auto`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>

      <Notification />
    </div>
  );
}
