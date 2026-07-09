import React, { useEffect, useState } from "react";
import NavBar from "../components/layout/Navbar.jsx";
import SideBar from "../components/layout/SideBar.jsx";
import ShrinkedSideBar from "../components/layout/ShrinkedSideBar.jsx";

export default function Structure({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <NavBar />

      <div className="flex items-center gap-12 h-[90%] relative">
        {isMobile ? <ShrinkedSideBar /> : <SideBar />}
        {children}
      </div>
    </div>
  );
}
