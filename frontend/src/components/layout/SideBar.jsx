import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sideBarOpen, sideBarClose } from "../../store/uiSlice.js";
import { sidebarMenus } from "../../lib/sideBarUtility.js";
import { Link } from "react-router-dom";

export default function SideBar() {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.ui.sideBar);
  // const isOpen = true;
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const menus = sidebarMenus[role] || [];
  return (
    <div
      onMouseEnter={() => dispatch(sideBarOpen())}
      onMouseLeave={() => dispatch(sideBarClose())}
      className={`
        fixed top-16 left-4 h-[90%] bg-yellow-300
        transition-all duration-300 ease-in-out rounded-lg overflow-hidden
        ${isOpen ? "w-64" : "w-18"}
      `}
    >
      <div
        className={`
    p-4 transition-opacity duration-200
  `}
      >
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className="
      flex items-center
      px-3 py-3 mb-2
      rounded-xl
      text-gray-800
      hover:bg-white
      hover:text-blue-600
      hover:shadow-md
      transition-all duration-300
    "
          >
            <img
              src={menu.icon}
              alt={menu.name}
              className="w-6 h-6 object-contain shrink-0"
            />

            <span
              className={`
        ml-3 whitespace-nowrap overflow-hidden
        transition-all duration-300
        ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
      `}
            >
              {menu.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
