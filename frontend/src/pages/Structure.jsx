import React from "react";
import NavBar from "../components/layout/Navbar.jsx";
import SideBar from "../components/layout/SideBar.jsx";

export default function Structure({ children }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <NavBar />
      <div className="flex items-center gap-12 h-[90%] relative">
        <SideBar />
        {children}
      </div>
    </div>
  );
}
